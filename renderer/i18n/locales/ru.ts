import type { Locale } from './en';

const ru: Locale = {
    menu: { file: 'Файл', build: 'Сборка', settings: 'Настройки' },
    file: {
        newFile: 'Новый файл', openFile: 'Открыть файл...', openFolder: 'Открыть папку...',
        closeFolder: 'Закрыть папку', save: 'Сохранить', saveAs: 'Сохранить как...',
        closeTab: 'Закрыть вкладку',
    },
    build: { compile: 'Компилировать', serverManager: 'Управление сервером', configEditor: 'Редактор конфигурации' },
    preferences: 'Настройки',
    window: {
        minimize: 'Свернуть', maximize: 'Развернуть', close: 'Закрыть',
        unsavedChangesConfirm: (count) => `Есть несохранённые изменения в ${count} файлах. Всё равно закрыть?`,
    },
    toolbar: { new: 'Новый', open: 'Открыть', save: 'Сохранить', compile: 'Скомпилировать', server: 'Сервер', config: 'Конфигурация', settings: 'Настройки' },
    welcome: {
        subtitle: 'Редактор SA-MP PAWN', newFile: 'Новый файл', openFile: 'Открыть файл',
        openFolder: 'Открыть папку', tip: 'Новый файл {ctrl_n}, открыть {ctrl_o}, скомпилировать {f5}',
    },
    output: { title: 'ВЫВОД', clear: 'Очистить', expand: 'Развернуть', collapse: 'Свернуть', placeholder: 'Вывод компилятора появится здесь…' },
    statusBar: { noFileOpen: 'Файл не открыт', line: 'Стр.', col: 'Кол.', lines: 'строк' },
    explorer: {
        open: 'Открыть', rename: 'Переименовать', newFile: 'Новый файл', newFolder: 'Новая папка',
        copyPath: 'Копировать путь', copyRelativePath: 'Копировать относительный путь', delete: 'Удалить',
        cancel: 'Отмена', deleteConfirm: (name) => `Удалить «${name}»?`,
        renamePlaceholder: 'Новое имя…', newFilePlaceholder: 'Имя файла (напр. script.pwn)', newFolderPlaceholder: 'Имя папки…',
    },
    tabs: {
        close: 'Закрыть', closeSaved: 'Закрыть сохранённые', closeOthers: 'Закрыть остальные',
        closeToRight: 'Закрыть справа', closeAll: 'Закрыть все',
        copyPath: 'Копировать путь', copyRelativePath: 'Копировать относительный путь',
        unsavedConfirm: (name) => `«${name}» не сохранён. Всё равно закрыть?`,
    },
    settingsModal: {
        title: 'Настройки', compiler: 'Компилятор', compilerPath: 'Путь к компилятору',
        includePaths: 'Пути включений', addPath: 'Добавить путь', remove: 'Удалить', browse: 'Обзор',
        editor: 'Редактор', fontSize: 'Размер шрифта', minimap: 'Миникарта', wordWrap: 'Перенос слов',
        autoSave: 'Автосохранение', autoSaveDelay: 'Задержка (мс)', integration: 'Интеграция',
        discordRPC: 'Discord RPC', language: 'Язык', cancel: 'Отмена', saveChanges: 'Сохранить',
        savedSuccess: 'Настройки сохранены.', selectCompiler: 'Выбрать компилятор', selectFolder: 'Выбрать папку', executables: 'Исполняемые файлы',
    },
    serverModal: {
        title: 'Сервер', serverControl: 'Управление сервером', notDetected: 'Сервер не найден',
        online: 'В сети', offline: 'Не в сети', startServer: 'Запустить', stop: 'Остановить',
        restart: 'Перезапустить', changePath: 'Изменить путь', consoleOutput: 'Вывод консоли',
        clear: 'Очистить', waitingForLogs: 'Ожидание логов…', close: 'Закрыть',
        failedToStart: (err) => `Ошибка запуска: ${err}`, selectServer: 'Выбрать сервер', executables: 'Исполняемые файлы',
    },
    encodingPicker: { placeholder: 'Кодировка…', noResults: 'Не найдено', encodingSet: (enc) => `Кодировка: ${enc}` },
    configModal: {
        title: 'Конфигурация', configFile: 'Файл конфигурации', noneSelected: 'Не выбрано',
        browse: 'Обзор', key: 'Ключ', value: 'Значение', addRow: 'Добавить строку',
        cancel: 'Отмена', saveConfig: 'Сохранить', saved: 'Сохранено.',
        selectConfig: 'Выбрать файл', configFiles: 'Файлы конфигурации',
        errorLoading: (err) => `Ошибка загрузки: ${err}`, errorSaving: (err) => `Ошибка сохранения: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `Скопирован путь: ${path}`, copiedRelative: (p) => `Скопирован относительный путь: ${p}`,
        errorRenaming: (err) => `Ошибка переименования: ${err}`, errorCreatingFile: (err) => `Ошибка создания файла: ${err}`,
        errorCreatingFolder: (err) => `Ошибка создания папки: ${err}`, errorDeleting: (err) => `Ошибка удаления: ${err}`,
        fileTooLarge: 'Файл слишком большой.', fileIsBinary: 'Файл является бинарным.',
    },
    sidebar: {
        explorer: 'ПРОВОДНИК', noFolderOpen: 'Папка не открыта', openFolder: 'Открыть папку',
        newFilePlaceholder: 'Имя файла (напр. script.pwn)', newFolderPlaceholder: 'Имя папки…',
        newFile: 'Новый файл', newFolder: 'Новая папка', refresh: 'Обновить', closeFolder: 'Закрыть папку',
    },
    sourceControl: {
        title: 'УПРАВЛЕНИЕ ВЕРСИЯМИ', noFolderOpen: 'Папка не открыта.', notGitRepo: 'Папка не является репозиторием Git.',
        initRepo: 'Инициализировать репозиторий', stagedChanges: 'Подготовленные изменения',
        changes: 'Изменения', untrackedFiles: 'Не отслеживаемые файлы', commits: 'Коммиты',
        noChanges: 'Нет изменений', noCommitsYet: 'Коммитов пока нет.',
        commitPlaceholder: 'Сообщение (Ctrl+Enter для коммита)', commit: 'Зафиксировать',
        pull: 'Pull', push: 'Push', stageAll: 'Подготовить всё', stash: 'Stash', stashPop: 'Stash Pop',
        refresh: 'Обновить', unstageAll: 'Сбросить всё', stageAllChanges: 'Подготовить все изменения',
        stageAllUntracked: 'Подготовить неотслеживаемые', openChanges: 'Открыть изменения',
        openFile: 'Открыть файл', openFileHead: 'Открыть файл (HEAD)', discardChanges: 'Отменить изменения',
        stageChanges: 'Подготовить изменения', unstageChanges: 'Сбросить подготовку',
        addToGitignore: 'Добавить в .gitignore', removeFromGitignore: 'Удалить из .gitignore', revealInFileExplorer: 'Показать в проводнике',
        revealInExplorerView: 'Показать в обозревателе', pulling: 'Получение...', pushing: 'Отправка...',
        outgoing: 'Исходящие', incoming: 'Входящие', commitDetails: 'Детали коммита',
        couldNotLoad: 'Не удалось загрузить детали.', pushPending: 'Ожидает push', pullPending: 'Ожидает pull',
    },
};

export default ru;
