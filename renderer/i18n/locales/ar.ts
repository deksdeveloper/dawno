import type { Locale } from './en';

const ar: Locale = {
    menu: { file: 'ملف', build: 'بناء', settings: 'إعدادات' },
    file: {
        newFile: 'ملف جديد', openFile: 'فتح ملف...', openFolder: 'فتح مجلد...',
        closeFolder: 'إغلاق المجلد', save: 'حفظ', saveAs: 'حفظ باسم...',
        closeTab: 'إغلاق التبويب',
    },
    build: { compile: 'تجميع', serverManager: 'مدير الخادم', configEditor: 'محرر الإعدادات' },
    preferences: 'تفضيلات',
    window: {
        minimize: 'تصغير', maximize: 'تكبير', close: 'إغلاق',
        unsavedChangesConfirm: (count) => `يوجد تغييرات غير محفوظة في ${count} ملف. هل تريد الإغلاق؟`,
    },
    toolbar: { new: 'جديد', open: 'فتح', save: 'حفظ', compile: 'تجميع', server: 'خادم', config: 'إعدادات', settings: 'إعدادات' },
    welcome: {
        subtitle: 'محرر SA-MP PAWN', newFile: 'ملف جديد', openFile: 'فتح ملف',
        openFolder: 'فتح مجلد', tip: 'ملف جديد {ctrl_n}، فتح {ctrl_o}، تجميع {f5}',
    },
    output: { title: 'المخرجات', clear: 'مسح', expand: 'توسيع', collapse: 'طي', placeholder: 'ستظهر مخرجات المترجم هنا…' },
    statusBar: { noFileOpen: 'لا يوجد ملف مفتوح', line: 'سطر', col: 'عمود', lines: 'سطور' },
    explorer: {
        open: 'فتح', rename: 'إعادة التسمية', newFile: 'ملف جديد', newFolder: 'مجلد جديد',
        copyPath: 'نسخ المسار', copyRelativePath: 'نسخ المسار النسبي', delete: 'حذف',
        cancel: 'إلغاء', deleteConfirm: (name) => `هل تريد حذف «${name}»؟`,
        renamePlaceholder: 'الاسم الجديد…', newFilePlaceholder: 'اسم الملف (مثال: script.pwn)', newFolderPlaceholder: 'اسم المجلد…',
    },
    tabs: {
        close: 'إغلاق', closeSaved: 'إغلاق المحفوظة', closeOthers: 'إغلاق الأخرى',
        closeToRight: 'إغلاق اليمين', closeAll: 'إغلاق الكل',
        copyPath: 'نسخ المسار', copyRelativePath: 'نسخ المسار النسبي',
        unsavedConfirm: (name) => `«${name}» غير محفوظ. هل تريد الإغلاق؟`,
    },
    settingsModal: {
        title: 'الإعدادات', compiler: 'المترجم', compilerPath: 'مسار المترجم',
        includePaths: 'مسارات التضمين', addPath: 'إضافة مسار', remove: 'حذف', browse: 'استعراض',
        editor: 'المحرر', fontSize: 'حجم الخط', minimap: 'الخريطة المصغرة', wordWrap: 'التفاف الكلمات',
        autoSave: 'الحفظ التلقائي', autoSaveDelay: 'التأخير (ms)', integration: 'التكامل',
        discordRPC: 'Discord RPC', language: 'اللغة', cancel: 'إلغاء', saveChanges: 'حفظ التغييرات',
        savedSuccess: 'تم حفظ الإعدادات.', selectCompiler: 'اختر المترجم', selectFolder: 'اختر المجلد', executables: 'الملفات التنفيذية',
    },
    serverModal: {
        title: 'الخادم', serverControl: 'التحكم في الخادم', notDetected: 'لم يُكتشف الخادم',
        online: 'متصل', offline: 'غير متصل', startServer: 'تشغيل', stop: 'إيقاف',
        restart: 'إعادة التشغيل', changePath: 'تغيير المسار', consoleOutput: 'مخرجات وحدة التحكم',
        clear: 'مسح', waitingForLogs: 'في انتظار السجلات…', close: 'إغلاق',
        failedToStart: (err) => `فشل التشغيل: ${err}`, selectServer: 'اختر الخادم', executables: 'الملفات التنفيذية',
    },
    encodingPicker: { placeholder: 'الترميز…', noResults: 'لا نتائج', encodingSet: (enc) => `الترميز: ${enc}` },
    configModal: {
        title: 'الإعدادات', configFile: 'ملف الإعداد', noneSelected: 'لم يُختر',
        browse: 'استعراض', key: 'مفتاح', value: 'قيمة', addRow: 'إضافة سطر',
        cancel: 'إلغاء', saveConfig: 'حفظ الإعداد', saved: 'تم الحفظ.',
        selectConfig: 'اختر ملف', configFiles: 'ملفات الإعداد',
        errorLoading: (err) => `خطأ في التحميل: ${err}`, errorSaving: (err) => `خطأ في الحفظ: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `تم نسخ المسار: ${path}`, copiedRelative: (p) => `تم نسخ المسار النسبي: ${p}`,
        errorRenaming: (err) => `خطأ في إعادة التسمية: ${err}`, errorCreatingFile: (err) => `خطأ في إنشاء الملف: ${err}`,
        errorCreatingFolder: (err) => `خطأ في إنشاء المجلد: ${err}`, errorDeleting: (err) => `خطأ في الحذف: ${err}`,
        fileTooLarge: 'الملف كبير جداً.', fileIsBinary: 'الملف ثنائي.',
    },
    sidebar: {
        explorer: 'المستكشف', noFolderOpen: 'لا يوجد مجلد مفتوح', openFolder: 'فتح مجلد',
        newFilePlaceholder: 'اسم الملف (مثال: script.pwn)', newFolderPlaceholder: 'اسم المجلد…',
        newFile: 'ملف جديد', newFolder: 'مجلد جديد', refresh: 'تحديث', closeFolder: 'إغلاق المجلد',
    },
    sourceControl: {
        title: 'التحكم في المصدر', noFolderOpen: 'لا يوجد مجلد مفتوح.', notGitRepo: 'المجلد ليس مستودع Git.',
        initRepo: 'تهيئة المستودع', stagedChanges: 'التغييرات المرحلية', changes: 'التغييرات',
        untrackedFiles: 'ملفات غير مُتتبَّعة', commits: 'التزامات', noChanges: 'لا تغييرات',
        noCommitsYet: 'لا توجد التزامات بعد.', commitPlaceholder: 'الرسالة (Ctrl+Enter للالتزام)', commit: 'التزام',
        pull: 'سحب', push: 'دفع', stageAll: 'تنظيم الكل', stash: 'Stash', stashPop: 'Stash Pop',
        refresh: 'تحديث', unstageAll: 'إلغاء التنظيم', stageAllChanges: 'تنظيم جميع التغييرات',
        stageAllUntracked: 'تنظيم غير المتتبَّعة', openChanges: 'فتح التغييرات',
        openFile: 'فتح الملف', openFileHead: 'فتح الملف (HEAD)', discardChanges: 'تجاهل التغييرات',
        stageChanges: 'تنظيم التغييرات', unstageChanges: 'إلغاء التنظيم',
        addToGitignore: 'إضافة إلى .gitignore', removeFromGitignore: 'إزالة من .gitignore', revealInFileExplorer: 'إظهار في المستكشف',
        revealInExplorerView: 'إظهار في عرض المستكشف', pulling: 'جارٍ السحب...', pushing: 'جارٍ الدفع...',
        outgoing: 'صادر', incoming: 'وارد', commitDetails: 'تفاصيل الالتزام',
        couldNotLoad: 'تعذّر تحميل التفاصيل.', pushPending: 'في انتظار الدفع', pullPending: 'في انتظار السحب',
    },
};

export default ar;
