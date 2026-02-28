import type { Locale } from './en';

const tr: Locale = {
    menu: {
        file: 'Dosya',
        build: 'Derleme',
        settings: 'Ayarlar',
    },
    file: {
        newFile: 'Yeni Dosya',
        openFile: 'Dosya Aç...',
        openFolder: 'Klasör Aç...',
        closeFolder: 'Klasörü Kapat',
        save: 'Kaydet',
        saveAs: 'Farklı Kaydet...',
        closeTab: 'Sekmeyi Kapat',
    },
    build: {
        compile: 'Derle',
        serverManager: 'Sunucu Yöneticisi',
        configEditor: 'Yapılandırma Editörü',
    },
    preferences: 'Tercihler',

    window: {
        minimize: 'Küçült',
        maximize: 'Büyüt',
        close: 'Kapat',
        unsavedChangesConfirm: (count: number) =>
            `${count} dosyada kaydedilmemiş değişiklik var. Yine de kapatılsın mı?`,
    },

    toolbar: {
        new: 'Yeni',
        open: 'Aç',
        save: 'Kaydet',
        compile: 'Derle',
        server: 'Sunucu',
        config: 'Yapılandırma',
        settings: 'Ayarlar',
    },

    welcome: {
        subtitle: 'SA-MP PAWN Editörü',
        newFile: 'Yeni Dosya',
        openFile: 'Dosya Aç',
        openFolder: 'Klasör Aç',
        tip: 'Yeni dosya için {ctrl_n}, açmak için {ctrl_o}, derlemek için {f5}',
    },

    output: {
        title: 'Çıktı',
        clear: 'Temizle',
        expand: 'Genişlet',
        collapse: 'Daralt',
        placeholder: 'Hazır. Derlemek için F5\'e basın.',
    },

    statusBar: {
        noFileOpen: 'Dosya açık değil',
        line: 'Sat',
        col: 'Sut',
    },

    explorer: {
        open: 'Aç',
        rename: 'Yeniden Adlandır',
        newFile: 'Yeni Dosya',
        newFolder: 'Yeni Klasör',
        copyPath: 'Yolu Kopyala',
        copyRelativePath: 'Göreli Yolu Kopyala',
        delete: 'Sil',
        cancel: 'İptal',
        deleteConfirm: (name: string) => `${name} silinsin mi? Çöp kutusuna taşınacak.`,
        renamePlaceholder: 'Yeni ad...',
        newFilePlaceholder: 'Dosya adı (ör. script.pwn)',
        newFolderPlaceholder: 'Klasör adı...',
    },

    tabs: {
        close: 'Kapat',
        closeSaved: 'Kaydedilenleri Kapat',
        closeOthers: 'Diğerlerini Kapat',
        closeToRight: 'Sağdakileri Kapat',
        closeAll: 'Tümünü Kapat',
        copyPath: 'Yolu Kopyala',
        copyRelativePath: 'Göreli Yolu Kopyala',
        unsavedConfirm: (name: string) => `"${name}" kaydedilmedi. Yine de kapatılsın mı?`,
    },

    settingsModal: {
        title: 'Tercihler',
        compiler: 'Derleyici',
        compilerPath: 'Derleyici Yolu (pawncc.exe)',
        browse: 'Gözat',
        editor: 'Editör',
        fontSize: 'Yazı Boyutu',
        integration: 'Entegrasyon',
        discordRPC: 'Discord Rich Presence',
        language: 'Dil',
        cancel: 'İptal',
        saveChanges: 'Değişiklikleri Kaydet',
        savedSuccess: 'Ayarlar başarıyla kaydedildi.',
        selectCompiler: 'Derleyici Seç',
        executables: 'Çalıştırılabilir Dosyalar',
    },

    serverModal: {
        title: 'Sunucu Yöneticisi',
        serverControl: 'Sunucu Kontrolü',
        notDetected: 'Tespit edilemedi',
        online: 'ÇEVRİMİÇİ',
        offline: 'ÇEVRİMDIŞI',
        startServer: 'Sunucuyu Başlat',
        stop: 'Durdur',
        restart: 'Yeniden Başlat',
        changePath: 'Yolu Değiştir',
        consoleOutput: 'Konsol Çıktısı',
        clear: 'Temizle',
        waitingForLogs: 'Sunucu logları bekleniyor...',
        close: 'Kapat',
        failedToStart: (err: string) => `Sunucu başlatılamadı: ${err}`,
        selectServer: 'Sunucu Çalıştırılabilir Dosyasını Seç',
        executables: 'Çalıştırılabilir Dosyalar',
    },

    encodingPicker: {
        placeholder: 'Dosya Kodlaması Seç...',
        noResults: 'Sonuç bulunamadı',
        encodingSet: (enc: string) => `Kodlama ${enc} olarak ayarlandı`,
    },

    configModal: {
        title: 'Yapılandırma Editörü',
        configFile: 'Yapılandırma Dosyası',
        noneSelected: 'Hiçbiri seçilmedi',
        browse: 'Gözat',
        key: 'Anahtar',
        value: 'Değer',
        addRow: '+ Satır Ekle',
        cancel: 'İptal',
        saveConfig: 'Yapılandırmayı Kaydet',
        saved: 'Yapılandırma kaydedildi.',
        selectConfig: 'Yapılandırma Dosyası Seç',
        configFiles: 'Yapılandırma Dosyaları',
        errorLoading: (err: string) => `Yapılandırma yüklenirken hata: ${err}`,
        errorSaving: (err: string) => `Kaydetme başarısız: ${err}`,
    },

    output_msgs: {
        copiedPath: (path: string) => `Yol kopyalandı: ${path}`,
        copiedRelative: (p: string) => `Göreli yol kopyalandı: ${p}`,
        errorRenaming: (err: string) => `Yeniden adlandırma hatası: ${err}`,
        errorCreatingFile: (err: string) => `Dosya oluşturma hatası: ${err}`,
        errorCreatingFolder: (err: string) => `Klasör oluşturma hatası: ${err}`,
        errorDeleting: (err: string) => `Silme hatası: ${err}`,
    },

    sidebar: {
        explorer: 'GEZGIN',
        noFolderOpen: 'Klasör açık değil',
        openFolder: 'Klasör Aç',
        newFilePlaceholder: 'Dosya adı (ör. script.pwn)',
        newFolderPlaceholder: 'Klasör adı...',
        newFile: 'Yeni Dosya',
        newFolder: 'Yeni Klasör',
        refresh: 'Yenile',
        closeFolder: 'Klasörü Kapat',
    },
};

export default tr;
