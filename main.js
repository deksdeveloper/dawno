const { app, BrowserWindow, ipcMain, dialog, Menu, shell, protocol } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const { spawn, exec } = require('child_process');
const DiscordRPC = require('discord-rpc');
const https = require('https');
const os = require('os');
const AdmZip = require('adm-zip');

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();

            const filePath = getFilePathFromArgs(commandLine);
            if (filePath) {
                mainWindow.webContents.send('open-external-file', filePath);
            }
        }
    });
}

function getFilePathFromArgs(argv) {
    if (!argv || argv.length === 0) return null;
    const exePath = process.execPath.toLowerCase();

    for (const arg of argv) {
        if (arg.startsWith('--')) continue;
        if (arg.toLowerCase() === exePath) continue;

        try {
            if (fs.existsSync(arg) && fs.statSync(arg).isFile()) {
                return arg;
            }
        } catch (e) { }
    }
    return null;
}

function registerFileProtocol() {
    if (process.platform !== 'win32') return;

    const exePath = process.execPath;
    const regQuery = `reg add "HKEY_CURRENT_USER\\Software\\Classes\\.pwn" /ve /t REG_SZ /d "DAWNO.File" /f && ` +
        `reg add "HKEY_CURRENT_USER\\Software\\Classes\\DAWNO.File" /ve /t REG_SZ /d "PAWN Script" /f && ` +
        `reg add "HKEY_CURRENT_USER\\Software\\Classes\\DAWNO.File\\DefaultIcon" /ve /t REG_SZ /d "${exePath},0" /f && ` +
        `reg add "HKEY_CURRENT_USER\\Software\\Classes\\DAWNO.File\\shell\\open\\command" /ve /t REG_SZ /d "\\"${exePath}\\" \\"%1\\"" /f`;

    require('child_process').exec(regQuery, (error) => {
        if (error) console.error('Failed to register .pwn file association:', error);
        else console.log('.pwn file association registered successfully.');
    });
}

let mainWindow;
let settingsFile;
let folderWatcher = null;


const clientId = '1405068425121763410';
let rpc = null;
let rpcEnabled = true;

let rpcReconnectTimer = null;

function initDiscordRPC(suppressLogs = false) {
    if (rpc || !rpcEnabled) return;

    try {
        rpc = new DiscordRPC.Client({ transport: 'ipc' });

        rpc.on('ready', () => {
            console.log('[RPC] Discord RPC connected.');
            updateDiscordPresence({
                details: 'DAWNO Editor',
                state: 'Idle',
                largeImageKey: 'logo',
                largeImageText: 'DAWNO Editor',
                instance: false,
            });
        });

        rpc.on('error', () => {
            if (!suppressLogs) console.log('[RPC] Discord RPC error.');
            cleanupRPC();
        });

        rpc.login({ clientId }).catch(() => {
            if (!suppressLogs) console.log('[RPC] Discord RPC login failed.');
            cleanupRPC();
        });
    } catch (err) {
        cleanupRPC();
    }
}

function cleanupRPC() {
    if (rpc) {
        try {
            // Remove listeners before destroying to prevent internal 'write' attempts
            rpc.removeAllListeners('ready');
            rpc.removeAllListeners('error');

            // Safer cleanup to avoid "read property of null" in discord-rpc internals
            if (rpc.transport && rpc.transport.socket) {
                rpc.destroy().catch(() => { });
            }
        } catch (e) { }
        rpc = null;
    }
}

// Global stability against library-level unhandled rejections (Discord RPC)
process.on('unhandledRejection', (reason, promise) => {
    // Silently consume to prevent process crash
});

process.on('uncaughtException', (err) => {
    // If it's rpc-related, ignore it, otherwise log
    if (err.message && err.message.includes('discord-rpc')) return;
    console.error('[CRASH] Uncaught Exception:', err);
});

function startRpcReconnectLoop() {
    if (rpcReconnectTimer) return;
    rpcReconnectTimer = setInterval(() => {
        if (rpcEnabled && !rpc) {
            initDiscordRPC(true); // Suppress logs during background retry
        }
    }, 60000); // retry every 60 seconds
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
            // Log removed to reduce terminal noise
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
        // Register a custom file interceptor to serve root-relative paths
        // such as /assets/style.css or /_next/static/... from the correct location
        protocol.interceptFileProtocol('file', (request, callback) => {
            let url = request.url.replace(/^file:\/\//, '');
            // Remove leading slash for Windows paths like /C:/...
            if (url.startsWith('/')) url = url.slice(1);

            url = decodeURIComponent(url);

            // Check if it's a root-relative path (not an absolute windows path)
            if (!/^[A-Za-z]:/.test(url)) {
                const rendererOut = path.join(__dirname, 'renderer', 'out');
                url = path.join(rendererOut, url);
            }
            callback({ path: path.normalize(url) });
        });
        mainWindow.loadFile(path.join(__dirname, 'renderer/out/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        // Check for updates on startup
        if (app.isPackaged) {
            autoUpdater.checkForUpdatesAndNotify();
        }

        // Handle initial file opening
        const initialFile = getFilePathFromArgs(process.argv);
        if (initialFile) {
            // Give the renderer a moment to initialize
            setTimeout(() => {
                mainWindow.webContents.send('open-external-file', initialFile);
            }, 1000);
        }
    });

    mainWindow.on('maximize', () => {
        if (mainWindow) mainWindow.webContents.send('window-state-change', 'maximized');
    });
    mainWindow.on('unmaximize', () => {
        if (mainWindow) mainWindow.webContents.send('window-state-change', 'normal');
    });

    mainWindow.on('app-command', (e, cmd) => {
        if (cmd === 'browser-backward') {
            mainWindow.webContents.send('nav-back');
        } else if (cmd === 'browser-forward') {
            mainWindow.webContents.send('nav-forward');
        }
    });
}

app.whenReady().then(() => {
    if (app.isPackaged) {
        registerFileProtocol();
        if (autoUpdater && typeof autoUpdater.checkForUpdatesAndNotify === 'function') {
            autoUpdater.checkForUpdatesAndNotify().catch(err => console.error('Update check failed:', err));
        }
    }

    settingsFile = path.join(app.getPath('userData'), 'settings.json');
    loadSettings();
    rpcEnabled = settingsData.discordRPC !== false;

    createWindow();
    Menu.setApplicationMenu(null);

    if (rpcEnabled) {
        setTimeout(() => initDiscordRPC(true), 2000); // Suppress log on launch
        startRpcReconnectLoop();
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

function isBinaryBuffer(buffer) {
    // Check for null bytes in the first 8KB to identify binary files
    const limit = Math.min(buffer.length, 8192);
    for (let i = 0; i < limit; i++) {
        if (buffer[i] === 0) return true;
    }
    return false;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB



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
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_FILE_SIZE) {
            files.push({ path: filePath, error: 'FILE_TOO_LARGE' });
            continue;
        }

        const buffer = fs.readFileSync(filePath);
        if (isBinaryBuffer(buffer)) {
            files.push({ path: filePath, error: 'FILE_IS_BINARY' });
            continue;
        }

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
    console.log(`[IPC] dialog-save-file called. filePath: ${filePath}, content length: ${content?.length}, encoding: ${encoding}`);
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
        if (result.canceled) {
            console.log('[IPC] Save dialog cancelled.');
            return null;
        }
        savePath = result.filePath;
    }
    console.log(`[IPC] Writing to file: ${savePath}`);
    const safeContent = content ?? '';
    const buffer = (encoding === 'utf-8') ? Buffer.from(safeContent, 'utf-8') : iconv.encode(safeContent, encoding);
    fs.writeFileSync(savePath, buffer);
    return savePath;
});

ipcMain.handle('read-file', async (event, filePath, encoding = 'utf-8') => {
    try {
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_FILE_SIZE) {
            return { content: null, error: 'FILE_TOO_LARGE' };
        }

        const buffer = fs.readFileSync(filePath);
        if (isBinaryBuffer(buffer)) {
            return { content: null, error: 'FILE_IS_BINARY' };
        }

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

ipcMain.handle('fs-create-file', async (event, filePath) => {
    try {
        if (fs.existsSync(filePath)) return { success: false, error: 'File already exists.' };
        fs.writeFileSync(filePath, '');
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('fs-create-folder', async (event, folderPath) => {
    try {
        if (fs.existsSync(folderPath)) return { success: false, error: 'Folder already exists.' };
        fs.mkdirSync(folderPath, { recursive: true });
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
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
        cleanupRPC();
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
    if (!startDir || currentDepth > maxDepth) return null;
    try {
        if (!fs.existsSync(startDir)) return null;
        const entries = await fs.promises.readdir(startDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isFile() && targetNames.includes(entry.name.toLowerCase())) {
                return path.join(startDir, entry.name);
            }
        }

        for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.') && !['node_modules', 'bin', 'obj'].includes(entry.name.toLowerCase())) {
                const found = await findFileRecursive(path.join(startDir, entry.name), targetNames, maxDepth, currentDepth + 1);
                if (found) return found;
            }
        }
    } catch (e) { }
    return null;
}

async function findFileWithParents(startDir, targetNames, downDepth = 4, upLevels = 5) {
    // First search downward from startDir
    const downResult = await findFileRecursive(startDir, targetNames, downDepth);
    if (downResult) return downResult;

    // Then search upward through parent directories, each time searching down
    let current = startDir;
    for (let i = 0; i < upLevels; i++) {
        const parent = path.dirname(current);
        if (parent === current) break; // reached filesystem root
        current = parent;
        // Search only immediate children of the parent (depth=1) to avoid redundant deep scans
        const upResult = await findFileRecursive(current, targetNames, 1);
        if (upResult) return upResult;
        // Also do a deeper scan from the parent (limited depth to avoid scanning too much)
        const deeperResult = await findFileRecursive(current, targetNames, 2);
        if (deeperResult) return deeperResult;
    }
    return null;
}

ipcMain.handle('detect-server', async (event, folderPath) => {
    const serverPath = await findFileWithParents(folderPath, ['omp-server.exe', 'samp-server.exe'], 4, 5);
    if (serverPath) {
        return { path: serverPath, type: serverPath.toLowerCase().includes('omp') ? 'omp' : 'samp' };
    }
    return null;
});

ipcMain.handle('detect-config', async (event, folderPath) => {
    return await findFileWithParents(folderPath, ['server.cfg', 'config.json'], 4, 5);
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
        try { serverProcess.kill(); } catch (e) { }
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


// ─────────────────────────────────────────────────────────────────────────────

// ─── GIT IPC HANDLERS ────────────────────────────────────────────────────────

function runGit(args, cwd) {
    return new Promise((resolve) => {
        // Use spawn with args array to avoid Windows shell quoting issues
        const argsArr = typeof args === 'string'
            ? args.match(/(?:[^\s"]+|"[^"]*")+/g).map(a => a.replace(/^"|"$/g, ''))
            : args;

        const proc = spawn('git', argsArr, {
            cwd,
            windowsHide: true,
            env: { ...process.env }
        });

        let stdout = '';
        let stderr = '';
        proc.stdout.on('data', d => { stdout += d.toString(); });
        proc.stderr.on('data', d => { stderr += d.toString(); });

        proc.on('close', (code) => {
            const success = code === 0;
            const combined = (stdout + stderr).trim();
            resolve({
                success,
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                error: success ? null : (combined || `git exited with code ${code}`)
            });
        });

        proc.on('error', (err) => {
            resolve({ success: false, stdout: '', stderr: '', error: err.message });
        });
    });
}

// Commit: always pass message as a separate arg (immunises against any shell quoting)
function runGitCommit(cwd, msg) {
    return new Promise((resolve) => {
        const proc = spawn('git', ['commit', '-m', msg], {
            cwd,
            windowsHide: true,
            env: { ...process.env }
        });

        let stdout = '';
        let stderr = '';
        proc.stdout.on('data', d => { stdout += d.toString(); });
        proc.stderr.on('data', d => { stderr += d.toString(); });

        proc.on('close', (code) => {
            const success = code === 0;
            const combined = (stdout + stderr).trim();
            resolve({
                success,
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                error: success ? null : (combined || `git commit exited with code ${code}`)
            });
        });

        proc.on('error', (err) => {
            resolve({ success: false, stdout: '', stderr: '', error: err.message });
        });
    });
}

ipcMain.handle('git-status', async (event, cwd) => {
    if (!cwd) return { success: false, error: 'No folder open.' };
    const res = await runGit(['status', '--porcelain', '-u', '--no-renames'], cwd);
    if (!res.success && (res.stderr + res.stdout).includes('not a git repository')) {
        return { success: false, notGitRepo: true };
    }
    if (!res.success) return { success: false, error: res.error };

    const staged = [];
    const unstaged = [];
    const untracked = [];

    // Split on newlines, strip carriage returns (Windows CRLF), skip empty lines
    res.stdout.split('\n').forEach(rawLine => {
        const line = rawLine.replace(/\r/g, '');
        if (line.length < 4) return; // need at least XY + space + 1 char

        const x = line[0]; // index/staged status
        const y = line[1]; // working-tree status
        // column 2 is always a space separator; filename starts at 3
        const file = line.slice(3).trim();
        if (!file) return;

        if (x === '?' && y === '?') {
            untracked.push({ file, status: '?' });
        } else {
            if (x !== ' ' && x !== '?') staged.push({ file, status: x });
            if (y !== ' ' && y !== '?') unstaged.push({ file, status: y });
        }
    });

    let ignoredFiles = [];
    try {
        const giPath = path.join(cwd, '.gitignore');
        if (fs.existsSync(giPath)) {
            ignoredFiles = fs.readFileSync(giPath, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
        }
    } catch (e) { }

    return { success: true, staged, unstaged, untracked, ignoredFiles };
});


ipcMain.handle('git-init', async (event, cwd) => {
    const res = await runGit('init', cwd);
    return { success: res.success, output: res.stdout || res.stderr, error: res.error };
});

ipcMain.handle('git-add', async (event, { cwd, file }) => {
    const target = file === 'ALL' ? '-A' : `"${file}"`;
    const res = await runGit(`add ${target}`, cwd);
    return { success: res.success, error: res.error };
});

ipcMain.handle('git-unstage', async (event, { cwd, file }) => {
    const res = await runGit(`restore --staged "${file}"`, cwd);
    return { success: res.success, error: res.error };
});

ipcMain.handle('git-commit', async (event, { cwd, msg }) => {
    const res = await runGitCommit(cwd, msg);
    return { success: res.success, output: res.stdout || res.stderr, error: res.error };
});

ipcMain.handle('git-discard', async (event, { cwd, file }) => {
    // For untracked files, delete them; for tracked, checkout
    const res = await runGit(`checkout -- "${file}"`, cwd);
    return { success: res.success, error: res.error };
});

ipcMain.handle('git-pull', async (event, cwd) => {
    const res = await runGit('pull', cwd);
    return { success: res.success, output: res.stdout || res.stderr, error: res.error };
});

ipcMain.handle('git-push', async (event, cwd) => {
    const res = await runGit('push', cwd);
    return { success: res.success, output: res.stdout || res.stderr, error: res.error };
});

ipcMain.handle('git-get-branch', async (event, cwd) => {
    if (!cwd) return { branch: null };
    const res = await runGit('rev-parse --abbrev-ref HEAD', cwd);
    if (!res.success) return { branch: null };
    return { branch: res.stdout };
});

ipcMain.handle('git-get-diff', async (event, { cwd, file, staged, commitHash }) => {
    if (commitHash) {
        const res = await runGit(['diff', `${commitHash}^!`, '--', file], cwd);
        return { success: res.success, diff: res.stdout, error: res.error };
    }
    const flag = staged ? '--cached' : '';
    const res = await runGit(`diff ${flag} "${file}"`, cwd);
    return { success: res.success, diff: res.stdout, error: res.error };
});

ipcMain.handle('git-get-log', async (event, cwd) => {
    if (!cwd) return { success: false, commits: [] };
    const res = await runGit(['log', '--oneline', '-50'], cwd);
    if (!res.success) return { success: false, commits: [] };
    const commits = res.stdout.split('\n').filter(Boolean).map(line => {
        const spaceIdx = line.indexOf(' ');
        if (spaceIdx === -1) return null;
        return { hash: line.slice(0, spaceIdx), message: line.slice(spaceIdx + 1) };
    }).filter(Boolean);
    return { success: true, commits };
});

ipcMain.handle('git-show-commit', async (event, { cwd, hash }) => {
    if (!cwd || !hash) return { success: false, error: 'No cwd or hash provided' };

    // Get stats (files changed etc)
    const statRes = await runGit(['show', '--name-status', '--oneline', hash], cwd);
    if (!statRes.success) return { success: false, error: statRes.error };

    // Parse the output:
    // First line is hash + msg. Following lines are 'M    file.html' or 'A    file.js'
    const lines = statRes.stdout.split('\n').map(l => l.replace(/\r/g, '').trim()).filter(Boolean);
    if (lines.length === 0) return { success: false, error: 'Empty output' };

    const commitLine = lines.shift(); // The hash + msg line

    const files = lines.map(l => {
        const parts = l.split(/\s+/);
        if (parts.length >= 2) {
            return { status: parts[0], path: parts.slice(1).join(' ') };
        }
        return null;
    }).filter(Boolean);

    return { success: true, commitLine, files };
});

ipcMain.handle('git-get-sync-status', async (event, cwd) => {
    if (!cwd) return { success: false, incoming: 0, outgoing: 0, incomingCommits: [], outgoingCommits: [] };

    // Fetch remote branch data without pulling
    await runGit(['fetch'], cwd);

    // Parse helper
    const parseLog = (stdout) => stdout.split('\n')
        .map(l => l.replace(/\r/g, '').trim())
        .filter(Boolean)
        .map(line => {
            const sep = line.indexOf(' ');
            if (sep === -1) return null;
            return { hash: line.slice(0, sep), message: line.slice(sep + 1) };
        }).filter(Boolean);

    // Outgoing commits (local, not yet pushed)
    const outRes = await runGit(['log', '--oneline', '@{u}..HEAD'], cwd);
    const outgoingCommits = outRes.success ? parseLog(outRes.stdout) : [];

    // Incoming commits (remote, not yet pulled)
    const inRes = await runGit(['log', '--oneline', 'HEAD..@{u}'], cwd);
    const incomingCommits = inRes.success ? parseLog(inRes.stdout) : [];

    return {
        success: true,
        incoming: incomingCommits.length,
        outgoing: outgoingCommits.length,
        incomingCommits,
        outgoingCommits
    };
});

ipcMain.handle('git-stash', async (event, cwd) => {
    const res = await runGit('stash', cwd);
    return { success: res.success, output: res.stdout || res.stderr, error: res.error };
});

ipcMain.handle('git-stash-pop', async (event, cwd) => {
    const res = await runGit('stash pop', cwd);
    return { success: res.success, output: res.stdout || res.stderr, error: res.error };
});

ipcMain.handle('git-add-gitignore', async (event, { cwd, file }) => {
    try {
        const giPath = path.join(cwd, '.gitignore');
        let content = '';
        if (fs.existsSync(giPath)) content = fs.readFileSync(giPath, 'utf8');
        const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
        const entry = file.replace(/\\/g, '/');
        if (!lines.includes(entry)) {
            content = content.endsWith('\n') ? content : content + '\n';
            fs.writeFileSync(giPath, content + entry + '\n', 'utf8');
        }
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('git-remove-gitignore', async (event, { cwd, file }) => {
    try {
        const giPath = path.join(cwd, '.gitignore');
        if (!fs.existsSync(giPath)) return { success: true };
        const content = fs.readFileSync(giPath, 'utf8');
        const entry = file.replace(/\\/g, '/');
        const newLines = content.split('\n').filter(l => l.trim() !== entry);
        fs.writeFileSync(giPath, newLines.join('\n'), 'utf8');
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('git-open-file-head', async (event, { cwd, file }) => {
    try {
        const res = await runGit(`show HEAD:"${file.replace(/\\/g, '/')}"`, cwd);
        if (!res.success) return { success: false, error: res.error };
        return { success: true, content: res.stdout };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('reveal-in-explorer', async (event, filePath) => {
    try {
        // Open the parent folder
        const dir = path.dirname(filePath);
        await shell.openPath(dir);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

// ─────────────────────────────────────────────────────────────────────────────


app.on('before-quit', () => {
    if (serverProcess) {
        try { serverProcess.kill(); } catch (e) { }
        serverProcess = null;
    }
});
