import type { Locale } from './en';

const it: Locale = {
    menu: { file: 'File', build: 'Compila', settings: 'Impostazioni' },
    file: {
        newFile: 'Nuovo file', openFile: 'Apri file...', openFolder: 'Apri cartella...',
        closeFolder: 'Chiudi cartella', save: 'Salva', saveAs: 'Salva con nome...',
        closeTab: 'Chiudi scheda',
    },
    build: { compile: 'Compila', serverManager: 'Gestore server', configEditor: 'Editor configurazione' },
    preferences: 'Preferenze',
    window: {
        minimize: 'Riduci a icona', maximize: 'Ingrandisci', close: 'Chiudi',
        unsavedChangesConfirm: (count) => `Ci sono modifiche non salvate in ${count} file. Chiudere comunque?`,
    },
    toolbar: { new: 'Nuovo', open: 'Apri', save: 'Salva', compile: 'Compila', server: 'Server', config: 'Configurazione', settings: 'Impostazioni' },
    welcome: {
        subtitle: 'Editor SA-MP PAWN', newFile: 'Nuovo file', openFile: 'Apri file',
        openFolder: 'Apri cartella', tip: 'Nuovo {ctrl_n}, apri {ctrl_o}, compila {f5}',
    },
    output: { title: 'OUTPUT', clear: 'Cancella', expand: 'Espandi', collapse: 'Comprimi', placeholder: "L'output del compilatore apparirà qui…" },
    statusBar: { noFileOpen: 'Nessun file aperto', line: 'Riga', col: 'Col.', lines: 'righe' },
    explorer: {
        open: 'Apri', rename: 'Rinomina', newFile: 'Nuovo file', newFolder: 'Nuova cartella',
        copyPath: 'Copia percorso', copyRelativePath: 'Copia percorso relativo', delete: 'Elimina',
        cancel: 'Annulla', deleteConfirm: (name) => `Eliminare «${name}»?`,
        renamePlaceholder: 'Nuovo nome…', newFilePlaceholder: 'Nome file (es. script.pwn)', newFolderPlaceholder: 'Nome cartella…',
    },
    tabs: {
        close: 'Chiudi', closeSaved: 'Chiudi salvati', closeOthers: 'Chiudi altri',
        closeToRight: 'Chiudi a destra', closeAll: 'Chiudi tutti',
        copyPath: 'Copia percorso', copyRelativePath: 'Copia percorso relativo',
        unsavedConfirm: (name) => `«${name}» non è salvato. Chiudere comunque?`,
    },
    settingsModal: {
        title: 'Impostazioni', compiler: 'Compilatore', compilerPath: 'Percorso compilatore',
        includePaths: 'Percorsi di inclusione', addPath: 'Aggiungi percorso', remove: 'Rimuovi', browse: 'Sfoglia',
        editor: 'Editor', fontSize: 'Dimensione carattere', minimap: 'Minimappa', wordWrap: 'A capo automatico',
        autoSave: 'Salvataggio automatico', autoSaveDelay: 'Ritardo (ms)', integration: 'Integrazione',
        discordRPC: 'Discord RPC', language: 'Lingua', cancel: 'Annulla', saveChanges: 'Salva modifiche',
        savedSuccess: 'Impostazioni salvate.', selectCompiler: 'Seleziona compilatore', selectFolder: 'Seleziona cartella', executables: 'Eseguibili',
    },
    serverModal: {
        title: 'Server', serverControl: 'Controllo server', notDetected: 'Server non rilevato',
        online: 'Online', offline: 'Offline', startServer: 'Avvia', stop: 'Ferma',
        restart: 'Riavvia', changePath: 'Cambia percorso', consoleOutput: 'Output console',
        clear: 'Cancella', waitingForLogs: 'In attesa dei log…', close: 'Chiudi',
        failedToStart: (err) => `Avvio fallito: ${err}`, selectServer: 'Seleziona server', executables: 'Eseguibili',
    },
    encodingPicker: { placeholder: 'Codifica…', noResults: 'Nessun risultato', encodingSet: (enc) => `Codifica: ${enc}` },
    configModal: {
        title: 'Configurazione', configFile: 'File di configurazione', noneSelected: 'Nessuno selezionato',
        browse: 'Sfoglia', key: 'Chiave', value: 'Valore', addRow: 'Aggiungi riga',
        cancel: 'Annulla', saveConfig: 'Salva configurazione', saved: 'Salvato.',
        selectConfig: 'Seleziona file', configFiles: 'File di configurazione',
        errorLoading: (err) => `Errore di caricamento: ${err}`, errorSaving: (err) => `Errore di salvataggio: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `Percorso copiato: ${path}`, copiedRelative: (p) => `Percorso relativo copiato: ${p}`,
        errorRenaming: (err) => `Errore rinomina: ${err}`, errorCreatingFile: (err) => `Errore creazione file: ${err}`,
        errorCreatingFolder: (err) => `Errore creazione cartella: ${err}`, errorDeleting: (err) => `Errore eliminazione: ${err}`,
        fileTooLarge: 'File troppo grande.', fileIsBinary: 'Il file è binario.',
    },
    sidebar: {
        explorer: 'ESPLORA RISORSE', noFolderOpen: 'Nessuna cartella aperta', openFolder: 'Apri cartella',
        newFilePlaceholder: 'Nome file (es. script.pwn)', newFolderPlaceholder: 'Nome cartella…',
        newFile: 'Nuovo file', newFolder: 'Nuova cartella', refresh: 'Aggiorna', closeFolder: 'Chiudi cartella',
    },
    sourceControl: {
        title: 'CONTROLLO DEL CODICE SORGENTE', noFolderOpen: 'Nessuna cartella aperta.', notGitRepo: 'La cartella non è un repository Git.',
        initRepo: 'Inizializza repository', stagedChanges: 'Modifiche preparate', changes: 'Modifiche',
        untrackedFiles: 'File non tracciati', commits: 'Commit', noChanges: 'Nessuna modifica',
        noCommitsYet: 'Nessun commit ancora.', commitPlaceholder: 'Messaggio (Ctrl+Invio per commit)', commit: 'Commit',
        pull: 'Pull', push: 'Push', stageAll: 'Prepara tutto', stash: 'Stash', stashPop: 'Stash Pop',
        refresh: 'Aggiorna', unstageAll: 'Rimuovi tutto', stageAllChanges: 'Prepara tutte le modifiche',
        stageAllUntracked: 'Prepara non tracciati', openChanges: 'Apri modifiche',
        openFile: 'Apri file', openFileHead: 'Apri file (HEAD)', discardChanges: 'Annulla modifiche',
        stageChanges: 'Prepara modifiche', unstageChanges: 'Rimuovi preparazione',
        addToGitignore: 'Aggiungi a .gitignore', removeFromGitignore: 'Rimuovi da .gitignore', revealInFileExplorer: "Mostra nell'esploratore",
        revealInExplorerView: "Mostra nella vista dell'esploratore", pulling: 'Recupero...', pushing: 'Invio...',
        outgoing: 'In uscita', incoming: 'In arrivo', commitDetails: 'Dettagli commit',
        couldNotLoad: 'Impossibile caricare i dettagli.', pushPending: 'Push in attesa', pullPending: 'Pull in attesa',
    },
};

export default it;
