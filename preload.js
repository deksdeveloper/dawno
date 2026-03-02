const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    onWindowStateChange: (cb) => ipcRenderer.on('window-state-change', (e, state) => cb(state)),


    openFile: (encoding) => ipcRenderer.invoke('dialog-open-file', encoding),
    saveFile: (data) => ipcRenderer.invoke('dialog-save-file', data),
    readFile: (filePath, encoding) => ipcRenderer.invoke('read-file', filePath, encoding),


    compileFile: (data) => ipcRenderer.invoke('compile-file', data),


    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (s) => ipcRenderer.invoke('save-settings', s),
    browseForFile: (opts) => ipcRenderer.invoke('browse-for-file', opts),
    browseForFolder: () => ipcRenderer.invoke('browse-for-folder'),
    openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
    readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
    getProjectConfig: (folderPath) => ipcRenderer.invoke('get-project-config', folderPath),
    saveProjectConfig: (data) => ipcRenderer.invoke('save-project-config', data),


    copyFile: (data) => ipcRenderer.invoke('fs-copy-file', data),
    moveFile: (data) => ipcRenderer.invoke('fs-move-file', data),
    deleteFile: (filePath) => ipcRenderer.invoke('fs-delete-file', filePath),
    exists: (filePath) => ipcRenderer.invoke('fs-exists', filePath),
    getStats: (filePath) => ipcRenderer.invoke('fs-get-stats', filePath),
    createFile: (filePath) => ipcRenderer.invoke('fs-create-file', filePath),
    createFolder: (folderPath) => ipcRenderer.invoke('fs-create-folder', folderPath),

    updateRPC: (data) => ipcRenderer.send('rpc-update', data),
    toggleRPC: (enabled) => ipcRenderer.send('rpc-toggle', enabled),

    onFolderChange: (cb) => {
        const wrappedCb = (e, data) => cb(data);
        ipcRenderer.on('folder-change', wrappedCb);
        return () => ipcRenderer.removeListener('folder-change', wrappedCb);
    },


    findPawncc: (folderPath) => ipcRenderer.invoke('find-pawncc', folderPath),


    detectServer: (folderPath) => ipcRenderer.invoke('detect-server', folderPath),
    startServer: (serverPath) => ipcRenderer.invoke('server-start', serverPath),
    stopServer: () => ipcRenderer.invoke('server-stop'),
    restartServer: (serverPath) => ipcRenderer.invoke('server-restart', serverPath),
    getServerStatus: () => ipcRenderer.invoke('server-status'),
    onServerLog: (cb) => ipcRenderer.on('server-log', (e, data) => cb(data)),
    onServerStatusChange: (cb) => ipcRenderer.on('server-status-change', (e, running) => cb(running)),


    detectConfig: (folderPath) => ipcRenderer.invoke('detect-config', folderPath),
    readConfigFile: (filePath) => ipcRenderer.invoke('read-config-file', filePath),
    writeConfigFile: (filePath, data, type) => ipcRenderer.invoke('write-config-file', { filePath, data, type }),

    onNavBack: (cb) => {
        const wrappedCb = () => cb();
        ipcRenderer.on('nav-back', wrappedCb);
        return () => ipcRenderer.removeListener('nav-back', wrappedCb);
    },
    onNavForward: (cb) => {
        const wrappedCb = () => cb();
        ipcRenderer.on('nav-forward', wrappedCb);
        return () => ipcRenderer.removeListener('nav-forward', wrappedCb);
    },
    onOpenFile: (cb) => {
        const wrappedCb = (e, filePath) => cb(filePath);
        ipcRenderer.on('open-external-file', wrappedCb);
        return () => ipcRenderer.removeListener('open-external-file', wrappedCb);
    },

    // ─── Git ────────────────────────────────────────────────────────────────
    gitStatus: (cwd) => ipcRenderer.invoke('git-status', cwd),
    gitInit: (cwd) => ipcRenderer.invoke('git-init', cwd),
    gitAdd: (cwd, file) => ipcRenderer.invoke('git-add', { cwd, file }),
    gitUnstage: (cwd, file) => ipcRenderer.invoke('git-unstage', { cwd, file }),
    gitCommit: (cwd, msg) => ipcRenderer.invoke('git-commit', { cwd, msg }),
    gitDiscard: (cwd, file) => ipcRenderer.invoke('git-discard', { cwd, file }),
    gitPull: (cwd) => ipcRenderer.invoke('git-pull', cwd),
    gitPush: (cwd) => ipcRenderer.invoke('git-push', cwd),
    gitGetBranch: (cwd) => ipcRenderer.invoke('git-get-branch', cwd),
    gitGetDiff: (cwd, file, staged, commitHash) => ipcRenderer.invoke('git-get-diff', { cwd, file, staged, commitHash }),
    gitGetLog: (cwd) => ipcRenderer.invoke('git-get-log', cwd),
    gitShowCommit: (cwd, hash) => ipcRenderer.invoke('git-show-commit', { cwd, hash }),
    gitStash: (cwd) => ipcRenderer.invoke('git-stash', cwd),
    gitStashPop: (cwd) => ipcRenderer.invoke('git-stash-pop', cwd),
    gitGetSyncStatus: (cwd) => ipcRenderer.invoke('git-get-sync-status', cwd),
    gitAddGitignore: (cwd, file) => ipcRenderer.invoke('git-add-gitignore', { cwd, file }),
    gitRemoveGitignore: (cwd, file) => ipcRenderer.invoke('git-remove-gitignore', { cwd, file }),
    gitOpenFileHead: (cwd, file) => ipcRenderer.invoke('git-open-file-head', { cwd, file }),
    revealInExplorer: (filePath) => ipcRenderer.invoke('reveal-in-explorer', filePath),

});

