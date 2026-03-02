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
        file: '文件',
        build: '构建',
        settings: '设置',
    },
    file: {
        newFile: '新建文件',
        openFile: '打开文件...',
        openFolder: '打开文件夹...',
        closeFolder: '关闭文件夹',
        save: '保存',
        saveAs: '另存为...',
        closeTab: '关闭标签页',
    },
    build: {
        compile: '编译',
        serverManager: '服务器管理器',
        configEditor: '配置编辑器',
    },
    preferences: '偏好设置',

    window: {
        minimize: '最小化',
        maximize: '最大化',
        close: '关闭',
        unsavedChangesConfirm: (count: number) =>
            `${count} 个文件有未保存的更改。确定关闭吗？`,
    },

    toolbar: {
        new: '新建',
        open: '打开',
        save: '保存',
        compile: '编译',
        server: '服务器',
        config: '配置',
        settings: '设置',
    },

    welcome: {
        subtitle: 'SA-MP PAWN 编辑器',
        newFile: '新建文件',
        openFile: '打开文件',
        openFolder: '打开文件夹',
        tip: '按 {ctrl_n} 新建文件，{ctrl_o} 打开，{f5} 编译',
    },

    output: {
        title: '输出',
        clear: '清空',
        expand: '展开',
        collapse: '折叠',
        placeholder: '就绪. 按下 F5 编译.',
    },

    statusBar: {
        noFileOpen: '未打开文件',
        line: '行',
        col: '列',
    },

    explorer: {
        open: '打开',
        rename: '重命名',
        newFile: '新建文件',
        newFolder: '新建文件夹',
        copyPath: '复制路径',
        copyRelativePath: '复制相对路径',
        delete: '删除',
        cancel: '取消',
        deleteConfirm: (name: string) => `删除 ${name}? 该操作会将文件移至回收站.`,
        renamePlaceholder: '新名称...',
        newFilePlaceholder: '文件名 (例如: script.pwn)',
        newFolderPlaceholder: '文件夹名称...',
    },

    tabs: {
        close: '关闭',
        closeSaved: '关闭已保存的标签页',
        closeOthers: '关闭其他',
        closeToRight: '关闭右侧',
        closeAll: '全部关闭',
        copyPath: '复制路径',
        copyRelativePath: '复制相对路径',
        unsavedConfirm: (name: string) => `"${name}" 未保存. 确定关闭吗?`,
    },

    settingsModal: {
        title: '偏好设置',
        compiler: '编译器',
        compilerPath: '编译器路径 (pawncc.exe)',
        browse: '浏览',
        editor: '编辑器',
        fontSize: '字体大小',
        integration: '集成',
        discordRPC: 'Discord 富文本状态',
        language: '语言',
        cancel: '取消',
        saveChanges: '保存更改',
        savedSuccess: '设置已成功保存.',
        selectCompiler: '选择编译器',
        executables: '可执行文件',
    },

    serverModal: {
        title: '服务器管理器',
        serverControl: '服务器控制',
        notDetected: '未检测到',
        online: '在线',
        offline: '离线',
        startServer: '启动服务器',
        stop: '停止',
        restart: '重启',
        changePath: '更改路径',
        consoleOutput: '控制台输出',
        clear: '清空',
        waitingForLogs: '等待服务器日志...',
        close: '关闭',
        failedToStart: (err: string) => `启动服务器失败: ${err}`,
        selectServer: '选择服务器可执行文件',
        executables: '可执行文件',
    },

    encodingPicker: {
        placeholder: '选择文件编码...',
        noResults: '未找到结果',
        encodingSet: (enc: string) => `编码已设置为 ${enc}`,
    },

    configModal: {
        title: '配置编辑器',
        configFile: '配置文件',
        noneSelected: '未选择',
        browse: '浏览',
        key: '键',
        value: '值',
        addRow: '+ 添加行',
        cancel: '取消',
        saveConfig: '保存配置',
        saved: '配置已保存.',
        selectConfig: '选择配置文件',
        configFiles: '配置文件',
        errorLoading: (err: string) => `加载配置时出错: ${err}`,
        errorSaving: (err: string) => `保存失败: ${err}`,
    },

    output_msgs: {
        copiedPath: (path: string) => `已复制路径: ${path}`,
        copiedRelative: (p: string) => `已复制相对路径: ${p}`,
        errorRenaming: (err: string) => `重命名时出错: ${err}`,
        errorCreatingFile: (err: string) => `创建文件时出错: ${err}`,
        errorCreatingFolder: (err: string) => `创建文件夹时出错: ${err}`,
        errorDeleting: (err: string) => `删除时出错: ${err}`,
    },

    sidebar: {
        explorer: '资源管理器',
        noFolderOpen: '未打开文件夹',
        openFolder: '打开文件夹',
        newFilePlaceholder: '文件名 (例如: script.pwn)',
        newFolderPlaceholder: '文件夹名称...',
        newFile: '新建文件',
        newFolder: '新建文件夹',
        refresh: '刷新',
        closeFolder: '关闭文件夹',
    },
};

export default zh;
