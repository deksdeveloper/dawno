import type { Locale } from './en';

const zh: Locale = {
    menu: { file: '文件', build: '生成', settings: '设置' },
    file: {
        newFile: '新建文件', openFile: '打开文件...', openFolder: '打开文件夹...',
        closeFolder: '关闭文件夹', save: '保存', saveAs: '另存为...',
        closeTab: '关闭选项卡',
    },
    build: { compile: '编译', serverManager: '服务器管理器', configEditor: '配置编辑器' },
    preferences: '首选项',
    window: {
        minimize: '最小化', maximize: '最大化', close: '关闭',
        unsavedChangesConfirm: (count) => `${count} 个文件有未保存的更改，确定关闭？`,
    },
    toolbar: { new: '新建', open: '打开', save: '保存', compile: '编译', server: '服务器', config: '配置', settings: '设置' },
    welcome: {
        subtitle: 'SA-MP PAWN 编辑器', newFile: '新建文件', openFile: '打开文件',
        openFolder: '打开文件夹', tip: '新建 {ctrl_n}，打开 {ctrl_o}，编译 {f5}',
    },
    output: { title: '输出', clear: '清空', expand: '展开', collapse: '收起', placeholder: '编译器输出将显示在此处…' },
    statusBar: { noFileOpen: '未打开文件', line: '行', col: '列', lines: '行' },
    explorer: {
        open: '打开', rename: '重命名', newFile: '新建文件', newFolder: '新建文件夹',
        copyPath: '复制路径', copyRelativePath: '复制相对路径', delete: '删除',
        cancel: '取消', deleteConfirm: (name) => `确定删除「${name}」？`,
        renamePlaceholder: '新名称…', newFilePlaceholder: '文件名（如 script.pwn）', newFolderPlaceholder: '文件夹名…',
    },
    tabs: {
        close: '关闭', closeSaved: '关闭已保存', closeOthers: '关闭其他',
        closeToRight: '关闭右侧', closeAll: '全部关闭',
        copyPath: '复制路径', copyRelativePath: '复制相对路径',
        unsavedConfirm: (name) => `「${name}」未保存，确定关闭？`,
    },
    settingsModal: {
        title: '设置', compiler: '编译器', compilerPath: '编译器路径',
        includePaths: '包含路径', addPath: '添加路径', remove: '删除', browse: '浏览',
        editor: '编辑器', fontSize: '字体大小', minimap: '缩略图', wordWrap: '自动换行',
        autoSave: '自动保存', autoSaveDelay: '延迟（毫秒）', integration: '集成',
        discordRPC: 'Discord RPC', language: '语言', cancel: '取消', saveChanges: '保存更改',
        savedSuccess: '设置已保存。', selectCompiler: '选择编译器', selectFolder: '选择文件夹', executables: '可执行文件',
    },
    serverModal: {
        title: '服务器', serverControl: '服务器控制', notDetected: '未检测到服务器',
        online: '在线', offline: '离线', startServer: '启动', stop: '停止',
        restart: '重启', changePath: '更改路径', consoleOutput: '控制台输出',
        clear: '清空', waitingForLogs: '等待日志…', close: '关闭',
        failedToStart: (err) => `启动失败：${err}`, selectServer: '选择服务器', executables: '可执行文件',
    },
    encodingPicker: { placeholder: '编码…', noResults: '无结果', encodingSet: (enc) => `编码设置：${enc}` },
    configModal: {
        title: '配置', configFile: '配置文件', noneSelected: '未选择',
        browse: '浏览', key: '键', value: '值', addRow: '添加行',
        cancel: '取消', saveConfig: '保存配置', saved: '已保存。',
        selectConfig: '选择文件', configFiles: '配置文件',
        errorLoading: (err) => `加载错误：${err}`, errorSaving: (err) => `保存错误：${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `已复制路径：${path}`, copiedRelative: (p) => `已复制相对路径：${p}`,
        errorRenaming: (err) => `重命名错误：${err}`, errorCreatingFile: (err) => `创建文件错误：${err}`,
        errorCreatingFolder: (err) => `创建文件夹错误：${err}`, errorDeleting: (err) => `删除错误：${err}`,
        fileTooLarge: '文件过大。', fileIsBinary: '文件为二进制。',
    },
    sidebar: {
        explorer: '资源管理器', noFolderOpen: '未打开文件夹', openFolder: '打开文件夹',
        newFilePlaceholder: '文件名（如 script.pwn）', newFolderPlaceholder: '文件夹名…',
        newFile: '新建文件', newFolder: '新建文件夹', refresh: '刷新', closeFolder: '关闭文件夹',
    },
    sourceControl: {
        title: '源代码管理', noFolderOpen: '未打开文件夹。', notGitRepo: '当前文件夹不是 Git 仓库。',
        initRepo: '初始化仓库', stagedChanges: '暂存的更改', changes: '更改',
        untrackedFiles: '未跟踪文件', commits: '提交', noChanges: '无更改',
        noCommitsYet: '暂无提交。', commitPlaceholder: '消息（Ctrl+Enter 提交）', commit: '提交',
        pull: '拉取', push: '推送', stageAll: '暂存全部', stash: '储藏', stashPop: '弹出储藏',
        refresh: '刷新', unstageAll: '取消全部暂存', stageAllChanges: '暂存所有更改',
        stageAllUntracked: '暂存未跟踪文件', openChanges: '打开更改', openFile: '打开文件',
        openFileHead: '打开文件 (HEAD)', discardChanges: '放弃更改', stageChanges: '暂存更改',
        unstageChanges: '取消暂存', addToGitignore: '添加到 .gitignore',
        revealInFileExplorer: '在资源管理器中显示', revealInExplorerView: '在浏览器视图中显示',
        pulling: '拉取中...', pushing: '推送中...',
        outgoing: '传出', incoming: '传入', commitDetails: '提交详情',
        couldNotLoad: '无法加载详情。', pushPending: '等待推送', pullPending: '等待拉取',
    },
};

export default zh;
