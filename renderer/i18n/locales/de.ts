import type { Locale } from './en';

const de: Locale = {
    menu: {
        file: 'Datei',
        build: 'Erstellen',
        settings: 'Einstellungen',
    },
    file: {
        newFile: 'Neue Datei',
        openFile: 'Datei öffnen...',
        openFolder: 'Ordner öffnen...',
        closeFolder: 'Ordner schließen',
        save: 'Speichern',
        saveAs: 'Speichern unter...',
        closeTab: 'Tab schließen',
    },
    build: {
        compile: 'Kompilieren',
        serverManager: 'Server-Manager',
        configEditor: 'Konfigurationseditor',
    },
    preferences: 'Einstellungen',

    window: {
        minimize: 'Minimieren',
        maximize: 'Maximieren',
        close: 'Schließen',
        unsavedChangesConfirm: (count: number) =>
            `${count} Datei(en) haben ungespeicherte Änderungen. Trotzdem schließen?`,
    },

    toolbar: {
        new: 'Neu',
        open: 'Öffnen',
        save: 'Speichern',
        compile: 'Kompilieren',
        server: 'Server',
        config: 'Konfiguration',
        settings: 'Einstellungen',
    },

    welcome: {
        subtitle: 'SA-MP PAWN-Editor',
        newFile: 'Neue Datei',
        openFile: 'Datei öffnen',
        openFolder: 'Ordner öffnen',
        tip: '{ctrl_n} für neue Datei, {ctrl_o} zum Öffnen, {f5} zum Kompilieren',
    },

    output: {
        title: 'Ausgabe',
        clear: 'Leeren',
        expand: 'Erweitern',
        collapse: 'Einklappen',
        placeholder: 'Bereit. F5 drücken zum Kompilieren.',
    },

    statusBar: {
        noFileOpen: 'Keine Datei geöffnet',
        line: 'Zl',
        col: 'Sp',
    },

    explorer: {
        open: 'Öffnen',
        rename: 'Umbenennen',
        newFile: 'Neue Datei',
        newFolder: 'Neuer Ordner',
        copyPath: 'Pfad kopieren',
        copyRelativePath: 'Relativen Pfad kopieren',
        delete: 'Löschen',
        cancel: 'Abbrechen',
        deleteConfirm: (name: string) => `${name} löschen? Es wird in den Papierkorb verschoben.`,
        renamePlaceholder: 'Neuer Name...',
        newFilePlaceholder: 'Dateiname (z.B. script.pwn)',
        newFolderPlaceholder: 'Ordnername...',
    },

    tabs: {
        close: 'Schließen',
        closeSaved: 'Gespeicherte schließen',
        closeOthers: 'Andere schließen',
        closeToRight: 'Tabs rechts schließen',
        closeAll: 'Alle schließen',
        copyPath: 'Pfad kopieren',
        copyRelativePath: 'Relativen Pfad kopieren',
        unsavedConfirm: (name: string) => `"${name}" ist nicht gespeichert. Trotzdem schließen?`,
    },

    settingsModal: {
        title: 'Einstellungen',
        compiler: 'Compiler',
        compilerPath: 'Compiler-Pfad (pawncc.exe)',
        browse: 'Durchsuchen',
        editor: 'Editor',
        fontSize: 'Schriftgröße',
        integration: 'Integration',
        discordRPC: 'Discord Rich Presence',
        language: 'Sprache',
        cancel: 'Abbrechen',
        saveChanges: 'Änderungen speichern',
        savedSuccess: 'Einstellungen erfolgreich gespeichert.',
        selectCompiler: 'Compiler auswählen',
        executables: 'Ausführbare Dateien',
    },

    serverModal: {
        title: 'Server-Manager',
        serverControl: 'Serversteuerung',
        notDetected: 'Nicht erkannt',
        online: 'ONLINE',
        offline: 'OFFLINE',
        startServer: 'Server starten',
        stop: 'Stoppen',
        restart: 'Neu starten',
        changePath: 'Pfad ändern',
        consoleOutput: 'Konsolenausgabe',
        clear: 'Leeren',
        waitingForLogs: 'Warte auf Server-Logs...',
        close: 'Schließen',
        failedToStart: (err: string) => `Server konnte nicht gestartet werden: ${err}`,
        selectServer: 'Server-Executable auswählen',
        executables: 'Ausführbare Dateien',
    },

    encodingPicker: {
        placeholder: 'Datei-Kodierung auswählen...',
        noResults: 'Keine Ergebnisse gefunden',
        encodingSet: (enc: string) => `Kodierung auf ${enc} gesetzt`,
    },

    configModal: {
        title: 'Konfigurationseditor',
        configFile: 'Konfigurationsdatei',
        noneSelected: 'Keine ausgewählt',
        browse: 'Durchsuchen',
        key: 'Schlüssel',
        value: 'Wert',
        addRow: '+ Zeile hinzufügen',
        cancel: 'Abbrechen',
        saveConfig: 'Konfiguration speichern',
        saved: 'Konfiguration gespeichert.',
        selectConfig: 'Konfigurationsdatei auswählen',
        configFiles: 'Konfigurationsdateien',
        errorLoading: (err: string) => `Fehler beim Laden der Konfiguration: ${err}`,
        errorSaving: (err: string) => `Speichern fehlgeschlagen: ${err}`,
    },

    output_msgs: {
        copiedPath: (path: string) => `Pfad kopiert: ${path}`,
        copiedRelative: (p: string) => `Relativer Pfad kopiert: ${p}`,
        errorRenaming: (err: string) => `Fehler beim Umbenennen: ${err}`,
        errorCreatingFile: (err: string) => `Fehler beim Erstellen der Datei: ${err}`,
        errorCreatingFolder: (err: string) => `Fehler beim Erstellen des Ordners: ${err}`,
        errorDeleting: (err: string) => `Fehler beim Löschen: ${err}`,
    },

    sidebar: {
        explorer: 'EXPLORER',
        noFolderOpen: 'Kein Ordner geöffnet',
        openFolder: 'Ordner öffnen',
        newFilePlaceholder: 'Dateiname (z.B. script.pwn)',
        newFolderPlaceholder: 'Ordnername...',
        newFile: 'Neue Datei',
        newFolder: 'Neuer Ordner',
        refresh: 'Aktualisieren',
        closeFolder: 'Ordner schließen',
    },
};

export default de;
