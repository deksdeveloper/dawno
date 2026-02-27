const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const { spawn } = require('child_process');
const DiscordRPC = require('discord-rpc');

let mainWindow;
let settingsFile;
let folderWatcher = null;


const clientId = '1405068425121763410'; 
let rpc = null;
let rpcEnabled = true;

function initDiscordRPC() {
    if (rpc || !rpcEnabled) return;

    try {
        rpc = new DiscordRPC.Client({ transport: 'ipc' });

        rpc.on('ready', () => {
            updateDiscordPresence({
                details: 'DAWNO Editor',
                state: 'Idle',
                largeImageKey: 'logo',
                largeImageText: 'DAWNO Editor',
                instance: false,
            });
        });

        rpc.on('error', () => {
            rpc = null;
        });

        rpc.login({ clientId }).catch(() => {
            rpc = null;
        });
    } catch (err) {
        rpc = null;
    }
}

function updateDiscordPresence(details) {
    if (!rpc || !rpcEnabled) return;
    try {
        rpc.setActivity(details).catch(() => {
            rpc = null;
        });
    } catch (e) {
        rpc = null;
    }
}
let settingsData = {
    compilerPath: '',
    includePaths: [],
    fontSize: 14,
    theme: 'dark'
};

function loadSettings() {
    try {
        if (settingsFile && fs.existsSync(settingsFile)) {
            settingsData = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
        }
    } catch (e) { }
}

function saveSettings() {
    try {
        if (settingsFile) {
            fs.writeFileSync(settingsFile, JSON.stringify(settingsData, null, 2));
            console.log('Settings saved to:', settingsFile);
        }
    } catch (e) {
        console.error('FAILED to save settings:', e);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon-256.png'),
        frame: false,
        backgroundColor: '#0d1117',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        show: false
    });

    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

    if (isDev) {
        const port = process.env.DEV_PORT || 3000;
        const loadDev = (p) => {
            mainWindow.loadURL(`http://localhost:${p}`).catch(() => {
                if (p < 3005) {
                    console.log(`Port ${p} not ready, trying ${p + 1}...`);
                    loadDev(p + 1);
                } else {
                    console.log('Dev server not found, falling back to static build');
                    mainWindow.loadFile(path.join(__dirname, 'renderer/out/index.html'));
                }
            });
        };
        
        setTimeout(() => loadDev(port), 1000);
    } else {
        mainWindow.loadFile(path.join(__dirname, 'renderer/out/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('maximize', () => {
        if (mainWindow) mainWindow.webContents.send('window-state-change', 'maximized');
    });
    mainWindow.on('unmaximize', () => {
        if (mainWindow) mainWindow.webContents.send('window-state-change', 'normal');
    });
}

app.whenReady().then(() => {
    settingsFile = path.join(app.getPath('userData'), 'settings.json');
    loadSettings();
    rpcEnabled = settingsData.discordRPC !== false;

    createWindow();
    Menu.setApplicationMenu(null);

    if (rpcEnabled) {
        setTimeout(initDiscordRPC, 2000);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});
ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});
ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
});


ipcMain.handle('dialog-open-file', async (event, encoding = 'utf-8') => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Open PAWN File',
        filters: [
            { name: 'PAWN Files', extensions: ['pwn', 'inc'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile', 'multiSelections']
    });
    if (result.canceled) return null;
    const files = [];
    for (const filePath of result.filePaths) {
        const buffer = fs.readFileSync(filePath);
        const content = decodeBuffer(buffer, encoding);
        files.push({ path: filePath, content });
    }
    return files;
});

function decodeBuffer(buffer, requestedEncoding) {
    if (isBufferUtf8(buffer)) return buffer.toString('utf-8');

    
    let targetEncoding = requestedEncoding;
    if (requestedEncoding === 'utf-8') {
        targetEncoding = settingsData.defaultEncoding || 'windows-1254';
    }

    try {
        return iconv.decode(buffer, targetEncoding);
    } catch (e) {
        console.error(`Decode failed for ${targetEncoding}, falling back to windows-1254`);
        return iconv.decode(buffer, 'windows-1254');
    }
}

ipcMain.handle('dialog-save-file', async (event, { filePath, content, encoding = 'utf-8' }) => {
    let savePath = filePath;
    if (!savePath) {
        const result = await dialog.showSaveDialog(mainWindow, {
            title: 'Save PAWN File',
            defaultPath: 'newscript.pwn',
            filters: [
                { name: 'PAWN Files', extensions: ['pwn', 'inc'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (result.canceled) return null;
        savePath = result.filePath;
    }
    const buffer = (encoding === 'utf-8') ? Buffer.from(content, 'utf-8') : iconv.encode(content, encoding);
    fs.writeFileSync(savePath, buffer);
    return savePath;
});

ipcMain.handle('read-file', async (event, filePath, encoding = 'utf-8') => {
    try {
        const buffer = fs.readFileSync(filePath);
        const content = decodeBuffer(buffer, encoding);
        return { content, error: null };
    } catch (e) {
        return { content: null, error: e.message };
    }
});


ipcMain.handle('compile-file', async (event, { filePath, compilerPath, includePaths, isLint }) => {
    return new Promise((resolve) => {
        if (!compilerPath || !fs.existsSync(compilerPath)) {
            resolve({ success: false, output: '❌ Compiler not found. Please set pawncc.exe path in Settings.' });
            return;
        }
        if (!filePath) {
            resolve({ success: false, output: '❌ No file to compile. Save your file first.' });
            return;
        }

        const args = [filePath];
        const fileDir = path.dirname(filePath);
        args.push(`-i${path.join(path.dirname(compilerPath), 'include')}`);
        args.push(`-i${fileDir}`);
        if (includePaths && includePaths.length > 0) {
            includePaths.forEach(p => args.push(`-i${p}`));
        }

        const outputAmx = filePath.replace(/\.(pwn|p)$/i, '.amx');
        if (isLint) {
            args.push(process.platform === 'win32' ? '-oNUL' : '-o/dev/null');
        } else {
            args.push(`-o${outputAmx}`);
        }

        let output = '';
        const proc = spawn(compilerPath, args, { cwd: fileDir });

        proc.stdout.on('data', d => output += d.toString());
        proc.stderr.on('data', d => output += d.toString());

        proc.on('close', (code) => {
            resolve({ success: code === 0, output: output || (code === 0 ? 'Compiled successfully.' : 'Compilation failed.'), code });
        });

        proc.on('error', (err) => {
            resolve({ success: false, output: `❌ Failed to start compiler: ${err.message}` });
        });
    });
});





ipcMain.handle('get-settings', () => settingsData);
ipcMain.handle('save-settings', (event, newSettings) => {
    console.log('IPC: save-settings received', newSettings);
    settingsData = { ...settingsData, ...newSettings };
    saveSettings();
    return settingsData;
});

ipcMain.handle('browse-for-file', async (event, { title, filters }) => {
    const result = await dialog.showOpenDialog(mainWindow, { title, filters, properties: ['openFile'] });
    if (result.canceled) return null;
    return result.filePaths[0];
});

ipcMain.handle('browse-for-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Include Directory',
        properties: ['openDirectory']
    });
    if (result.canceled) return null;
    return result.filePaths[0];
});
ipcMain.handle('open-folder-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    if (result.canceled) return null;

    const folderPath = result.filePaths[0];
    setupFolderWatcher(folderPath);
    return folderPath;
});

function setupFolderWatcher(folderPath) {
    if (folderWatcher) {
        folderWatcher.close();
    }

    try {
        folderWatcher = fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
            if (mainWindow) {
                mainWindow.webContents.send('folder-change', { eventType, filename });
            }
        });
    } catch (err) {
        console.error('Failed to watch folder:', err);
    }
}


ipcMain.handle('save-project-config', async (event, { folderPath, config }) => {
    try {
        const dawnoDir = path.join(folderPath, '.dawno');
        if (!fs.existsSync(dawnoDir)) {
            fs.mkdirSync(dawnoDir, { recursive: true });
        }
        const configPath = path.join(dawnoDir, 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return true;
    } catch (err) {
        console.error('Save Project Config Error:', err);
        return false;
    }
});

ipcMain.handle('get-project-config', async (event, folderPath) => {
    try {
        const configPath = path.join(folderPath, '.dawno', 'config.json');
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Get Project Config Error:', err);
    }
    return null;
});

function isBufferUtf8(buf) {
    if (!buf) return false;
    let i = 0;
    while (i < buf.length) {
        if (buf[i] <= 0x7F) i += 1;
        else if (buf[i] >= 0xC2 && buf[i] <= 0xDF && i + 1 < buf.length && buf[i + 1] >= 0x80 && buf[i + 1] <= 0xBF) i += 2;
        else if (buf[i] === 0xE0 && i + 2 < buf.length && buf[i + 1] >= 0xA0 && buf[i + 1] <= 0xBF && buf[i + 2] >= 0x80 && buf[i + 2] <= 0xBF) i += 3;
        else if (buf[i] >= 0xE1 && buf[i] <= 0xEF && i + 2 < buf.length && buf[i + 1] >= 0x80 && buf[i + 1] <= 0xBF && buf[i + 2] >= 0x80 && buf[i + 2] <= 0xBF) i += 3;
        else if (buf[i] === 0xF0 && i + 3 < buf.length && buf[i + 1] >= 0x90 && buf[i + 1] <= 0xBF && buf[i + 2] >= 0x80 && buf[i + 2] <= 0xBF && buf[i + 3] >= 0x80 && buf[i + 3] <= 0xBF) i += 4;
        else if (buf[i] >= 0xF1 && buf[i] <= 0xF3 && i + 3 < buf.length && buf[i + 1] >= 0x80 && buf[i + 1] <= 0xBF && buf[i + 2] >= 0x80 && buf[i + 2] <= 0xBF && buf[i + 3] >= 0x80 && buf[i + 3] <= 0xBF) i += 4;
        else if (buf[i] === 0xF4 && i + 3 < buf.length && buf[i + 1] >= 0x80 && buf[i + 1] <= 0x8F && buf[i + 2] >= 0x80 && buf[i + 2] <= 0xBF && buf[i + 3] >= 0x80 && buf[i + 3] <= 0xBF) i += 4;
        else return false;
    }
    return true;
}

ipcMain.handle('read-directory', async (event, dirPath) => {
    try {
        const stats = await fs.promises.stat(dirPath);
        if (!stats.isDirectory()) return null;

        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
        const result = [];
        for (const file of files) {
            if (file.name.startsWith('.') || file.name === 'node_modules' || file.name === '.git') continue;
            result.push({
                name: file.name,
                path: path.join(dirPath, file.name),
                isDirectory: file.isDirectory()
            });
        }
        return result.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
        });
    } catch (err) {
        if (err.code !== 'ENOTDIR') {
            console.error('Read Directory Error:', err);
        }
        return null;
    }
});

ipcMain.handle('fs-copy-file', async (event, { src, dest }) => {
    try {
        
        await fs.promises.cp(src, dest, { recursive: true });
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('fs-move-file', async (event, { src, dest }) => {
    try {
        await fs.promises.rename(src, dest);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('fs-delete-file', async (event, filePath) => {
    try {
        await shell.trashItem(filePath);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('fs-exists', async (event, filePath) => {
    return fs.existsSync(filePath);
});

ipcMain.handle('fs-get-stats', async (event, filePath) => {
    try {
        const stats = await fs.promises.stat(filePath);
        return {
            exists: true,
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile(),
            size: stats.size
        };
    } catch (err) {
        return { exists: false };
    }
});


ipcMain.on('rpc-update', (event, details) => {
    updateDiscordPresence(details);
});

ipcMain.on('rpc-toggle', (event, enabled) => {
    rpcEnabled = enabled;
    if (rpcEnabled) {
        if (!rpc) initDiscordRPC();
    } else {
        if (rpc) {
            rpc.clearActivity();
            rpc.destroy();
            rpc = null;
        }
    }
});


ipcMain.handle('find-pawncc', async (event, folderPath) => {
    
    const candidates = ['pawno', 'qawno'];
    let current = folderPath;

    for (let level = 0; level < 5; level++) {
        for (const candidate of candidates) {
            const pawnccPath = path.join(current, candidate, 'pawncc.exe');
            if (fs.existsSync(pawnccPath)) {
                
                settingsData.compilerPath = pawnccPath;
                saveSettings();
                return pawnccPath;
            }
        }
        const parent = path.dirname(current);
        if (parent === current) break; 
        current = parent;
    }
    return null;
});


async function findFileRecursive(startDir, targetNames, maxDepth = 4, currentDepth = 0) {
    if (currentDepth > maxDepth) return null;
    try {
        const entries = await fs.promises.readdir(startDir, { withFileTypes: true });

        
        for (const entry of entries) {
            if (entry.isFile() && targetNames.includes(entry.name.toLowerCase())) {
                return path.join(startDir, entry.name);
            }
        }

        
        for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                const found = await findFileRecursive(path.join(startDir, entry.name), targetNames, maxDepth, currentDepth + 1);
                if (found) return found;
            }
        }
    } catch (e) { }
    return null;
}

ipcMain.handle('detect-server', async (event, folderPath) => {
    const serverPath = await findFileRecursive(folderPath, ['omp-server.exe', 'samp-server.exe']);
    if (serverPath) {
        return { path: serverPath, type: serverPath.toLowerCase().includes('omp') ? 'omp' : 'samp' };
    }
    return null;
});

ipcMain.handle('detect-config', async (event, folderPath) => {
    return await findFileRecursive(folderPath, ['server.cfg', 'config.json']);
});


let serverProcess = null;

ipcMain.handle('server-start', async (event, serverPath) => {
    if (serverProcess) {
        return { success: false, error: 'Server is already running.' };
    }
    if (!serverPath || !fs.existsSync(serverPath)) {
        return { success: false, error: 'Server executable not found.' };
    }

    try {
        const serverDir = path.dirname(serverPath);
        serverProcess = spawn(serverPath, [], { cwd: serverDir, windowsHide: true });

        serverProcess.stdout.on('data', (data) => {
            if (mainWindow) mainWindow.webContents.send('server-log', { type: 'out', text: data.toString() });
        });
        serverProcess.stderr.on('data', (data) => {
            if (mainWindow) mainWindow.webContents.send('server-log', { type: 'err', text: data.toString() });
        });
        serverProcess.on('close', (code) => {
            serverProcess = null;
            if (mainWindow) mainWindow.webContents.send('server-log', { type: 'info', text: `\n[Server process exited with code ${code}]\n` });
            if (mainWindow) mainWindow.webContents.send('server-status-change', false);
        });
        serverProcess.on('error', (err) => {
            serverProcess = null;
            if (mainWindow) mainWindow.webContents.send('server-log', { type: 'err', text: `[Failed to start server: ${err.message}]\n` });
            if (mainWindow) mainWindow.webContents.send('server-status-change', false);
        });

        if (mainWindow) mainWindow.webContents.send('server-status-change', true);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('server-stop', async () => {
    if (!serverProcess) return { success: false, error: 'Server is not running.' };
    try {
        serverProcess.kill();
        serverProcess = null;
        if (mainWindow) mainWindow.webContents.send('server-status-change', false);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('server-status', () => {
    return { running: serverProcess !== null };
});

ipcMain.handle('server-restart', async (event, serverPath) => {
    
    if (serverProcess) {
        try { serverProcess.kill(); } catch (e) {  }
        serverProcess = null;
        if (mainWindow) mainWindow.webContents.send('server-status-change', false);
        await new Promise(r => setTimeout(r, 1000));
    }
    
    return new Promise((resolve) => {
        if (!serverPath || !fs.existsSync(serverPath)) {
            resolve({ success: false, error: 'Server executable not found.' });
            return;
        }
        try {
            const serverDir = path.dirname(serverPath);
            serverProcess = spawn(serverPath, [], { cwd: serverDir, windowsHide: true });

            serverProcess.stdout.on('data', (data) => {
                if (mainWindow) mainWindow.webContents.send('server-log', { type: 'out', text: data.toString() });
            });
            serverProcess.stderr.on('data', (data) => {
                if (mainWindow) mainWindow.webContents.send('server-log', { type: 'err', text: data.toString() });
            });
            serverProcess.on('close', (code) => {
                serverProcess = null;
                if (mainWindow) mainWindow.webContents.send('server-log', { type: 'info', text: `\n[Server process exited with code ${code}]\n` });
                if (mainWindow) mainWindow.webContents.send('server-status-change', false);
            });
            serverProcess.on('error', (err) => {
                serverProcess = null;
                if (mainWindow) mainWindow.webContents.send('server-log', { type: 'err', text: `[Failed to start server: ${err.message}]\n` });
                if (mainWindow) mainWindow.webContents.send('server-status-change', false);
            });

            if (mainWindow) mainWindow.webContents.send('server-status-change', true);
            resolve({ success: true });
        } catch (err) {
            resolve({ success: false, error: err.message });
        }
    });
});


ipcMain.handle('read-config-file', async (event, filePath) => {
    try {
        if (!fs.existsSync(filePath)) return { success: false, error: 'Config file not found.' };
        const content = fs.readFileSync(filePath, 'utf-8');
        const ext = path.extname(filePath).toLowerCase();

        if (ext === '.json') {
            try {
                return { success: true, type: 'json', data: JSON.parse(content), raw: content };
            } catch (e) {
                return { success: false, error: 'Invalid JSON: ' + e.message };
            }
        } else {
            
            const data = {};
            content.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) return;
                const spaceIdx = trimmed.indexOf(' ');
                if (spaceIdx !== -1) {
                    data[trimmed.substring(0, spaceIdx)] = trimmed.substring(spaceIdx + 1).trim();
                } else {
                    data[trimmed] = '';
                }
            });
            return { success: true, type: 'cfg', data, raw: content };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('write-config-file', async (event, { filePath, data, type }) => {
    try {
        let content = '';
        if (type === 'json') {
            content = JSON.stringify(data, null, 2);
        } else {
            
            content = Object.entries(data).map(([k, v]) => v !== '' ? `${k} ${v}` : k).join('\n');
        }
        fs.writeFileSync(filePath, content, 'utf-8');
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});


app.on('before-quit', () => {
    if (serverProcess) {
        try { serverProcess.kill(); } catch (e) {  }
        serverProcess = null;
    }
});
