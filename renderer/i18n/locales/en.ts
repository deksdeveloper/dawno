export interface Locale {
    menu: {
        file: string;
        build: string;
        settings: string;
    };
    file: {
        newFile: string;
        openFile: string;
        openFolder: string;
        closeFolder: string;
        save: string;
        saveAs: string;
        closeTab: string;
    };
    build: {
        compile: string;
        serverManager: string;
        configEditor: string;
    };
    preferences: string;

    window: {
        minimize: string;
        maximize: string;
        close: string;
        unsavedChangesConfirm: (count: number) => string;
    };

    toolbar: {
        new: string;
        open: string;
        save: string;
        compile: string;
        server: string;
        config: string;
        settings: string;
    };

    welcome: {
        subtitle: string;
        newFile: string;
        openFile: string;
        openFolder: string;
        tip: string;
    };

    output: {
        title: string;
        clear: string;
        expand: string;
        collapse: string;
        placeholder: string;
    };

    statusBar: {
        noFileOpen: string;
        line: string;
        col: string;
    };

    explorer: {
        open: string;
        rename: string;
        newFile: string;
        newFolder: string;
        copyPath: string;
        copyRelativePath: string;
        delete: string;
        cancel: string;
        deleteConfirm: (name: string) => string;
        renamePlaceholder: string;
        newFilePlaceholder: string;
        newFolderPlaceholder: string;
    };

    tabs: {
        close: string;
        closeSaved: string;
        closeOthers: string;
        closeToRight: string;
        closeAll: string;
        copyPath: string;
        copyRelativePath: string;
        unsavedConfirm: (name: string) => string;
    };

    settingsModal: {
        title: string;
        compiler: string;
        compilerPath: string;
        browse: string;
        editor: string;
        fontSize: string;
        integration: string;
        discordRPC: string;
        language: string;
        cancel: string;
        saveChanges: string;
        savedSuccess: string;
        selectCompiler: string;
        executables: string;
    };

    serverModal: {
        title: string;
        serverControl: string;
        notDetected: string;
        online: string;
        offline: string;
        startServer: string;
        stop: string;
        restart: string;
        changePath: string;
        consoleOutput: string;
        clear: string;
        waitingForLogs: string;
        close: string;
        failedToStart: (err: string) => string;
        selectServer: string;
        executables: string;
    };

    encodingPicker: {
        placeholder: string;
        noResults: string;
        encodingSet: (enc: string) => string;
    };

    configModal: {
        title: string;
        configFile: string;
        noneSelected: string;
        browse: string;
        key: string;
        value: string;
        addRow: string;
        cancel: string;
        saveConfig: string;
        saved: string;
        selectConfig: string;
        configFiles: string;
        errorLoading: (err: string) => string;
        errorSaving: (err: string) => string;
    };

    output_msgs: {
        copiedPath: (path: string) => string;
        copiedRelative: (p: string) => string;
        errorRenaming: (err: string) => string;
        errorCreatingFile: (err: string) => string;
        errorCreatingFolder: (err: string) => string;
        errorDeleting: (err: string) => string;
    };

    sidebar: {
        explorer: string;
        noFolderOpen: string;
        openFolder: string;
        newFilePlaceholder: string;
        newFolderPlaceholder: string;
        newFile: string;
        newFolder: string;
        refresh: string;
        closeFolder: string;
    };
}

const en: Locale = {
    menu: {
        file: 'File',
        build: 'Build',
        settings: 'Settings',
    },
    file: {
        newFile: 'New File',
        openFile: 'Open File...',
        openFolder: 'Open Folder...',
        closeFolder: 'Close Folder',
        save: 'Save',
        saveAs: 'Save As...',
        closeTab: 'Close Tab',
    },
    build: {
        compile: 'Compile',
        serverManager: 'Server Manager',
        configEditor: 'Config Editor',
    },
    preferences: 'Preferences',

    window: {
        minimize: 'Minimize',
        maximize: 'Maximize',
        close: 'Close',
        unsavedChangesConfirm: (count: number) =>
            `${count} file(s) have unsaved changes. Close anyway?`,
    },

    toolbar: {
        new: 'New',
        open: 'Open',
        save: 'Save',
        compile: 'Compile',
        server: 'Server',
        config: 'Config',
        settings: 'Settings',
    },

    welcome: {
        subtitle: 'SA-MP PAWN Editor',
        newFile: 'New File',
        openFile: 'Open File',
        openFolder: 'Open Folder',
        tip: 'Press {ctrl_n} for new file, {ctrl_o} to open, {f5} to compile',
    },

    output: {
        title: 'Output',
        clear: 'Clear',
        expand: 'Expand',
        collapse: 'Collapse',
        placeholder: 'Ready. Press F5 to compile.',
    },

    statusBar: {
        noFileOpen: 'No file open',
        line: 'Ln',
        col: 'Col',
    },

    explorer: {
        open: 'Open',
        rename: 'Rename',
        newFile: 'New File',
        newFolder: 'New Folder',
        copyPath: 'Copy Path',
        copyRelativePath: 'Copy Relative Path',
        delete: 'Delete',
        cancel: 'Cancel',
        deleteConfirm: (name: string) => `Delete ${name}? This will move it to Trash.`,
        renamePlaceholder: 'New name...',
        newFilePlaceholder: 'File name (e.g. script.pwn)',
        newFolderPlaceholder: 'Folder name...',
    },

    tabs: {
        close: 'Close',
        closeSaved: 'Close Saved',
        closeOthers: 'Close Others',
        closeToRight: 'Close to the Right',
        closeAll: 'Close All',
        copyPath: 'Copy Path',
        copyRelativePath: 'Copy Relative Path',
        unsavedConfirm: (name: string) => `"${name}" is unsaved. Close anyway?`,
    },

    settingsModal: {
        title: 'Preferences',
        compiler: 'Compiler',
        compilerPath: 'Compiler Path (pawncc.exe)',
        browse: 'Browse',
        editor: 'Editor',
        fontSize: 'Font Size',
        integration: 'Integration',
        discordRPC: 'Discord Rich Presence',
        language: 'Language',
        cancel: 'Cancel',
        saveChanges: 'Save Changes',
        savedSuccess: 'Settings saved successfully.',
        selectCompiler: 'Select Compiler',
        executables: 'Executables',
    },

    serverModal: {
        title: 'Server Manager',
        serverControl: 'Server Control',
        notDetected: 'Not detected',
        online: 'ONLINE',
        offline: 'OFFLINE',
        startServer: 'Start Server',
        stop: 'Stop',
        restart: 'Restart',
        changePath: 'Change Path',
        consoleOutput: 'Console Output',
        clear: 'Clear',
        waitingForLogs: 'Waiting for server logs...',
        close: 'Close',
        failedToStart: (err: string) => `Failed to start server: ${err}`,
        selectServer: 'Select Server Executable',
        executables: 'Executables',
    },

    encodingPicker: {
        placeholder: 'Select File Encoding...',
        noResults: 'No results found',
        encodingSet: (enc: string) => `Encoding set to ${enc}`,
    },

    configModal: {
        title: 'Config Editor',
        configFile: 'Configuration File',
        noneSelected: 'None selected',
        browse: 'Browse',
        key: 'Key',
        value: 'Value',
        addRow: '+ Add Row',
        cancel: 'Cancel',
        saveConfig: 'Save Config',
        saved: 'Config saved.',
        selectConfig: 'Select Config File',
        configFiles: 'Config Files',
        errorLoading: (err: string) => `Error loading config: ${err}`,
        errorSaving: (err: string) => `Save failed: ${err}`,
    },

    output_msgs: {
        copiedPath: (path: string) => `Copied path: ${path}`,
        copiedRelative: (p: string) => `Copied relative path: ${p}`,
        errorRenaming: (err: string) => `Error renaming: ${err}`,
        errorCreatingFile: (err: string) => `Error creating file: ${err}`,
        errorCreatingFolder: (err: string) => `Error creating folder: ${err}`,
        errorDeleting: (err: string) => `Error deleting: ${err}`,
    },

    sidebar: {
        explorer: 'EXPLORER',
        noFolderOpen: 'No folder open',
        openFolder: 'Open Folder',
        newFilePlaceholder: 'File name (e.g. script.pwn)',
        newFolderPlaceholder: 'Folder name...',
        newFile: 'New File',
        newFolder: 'New Folder',
        refresh: 'Refresh',
        closeFolder: 'Close Folder',
    },
};

export default en;
