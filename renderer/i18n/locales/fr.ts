import type { Locale } from './en';

const fr: Locale = {
    menu: { file: 'Fichier', build: 'Compilation', settings: 'Paramètres' },
    file: {
        newFile: 'Nouveau fichier', openFile: 'Ouvrir un fichier...', openFolder: 'Ouvrir un dossier...',
        closeFolder: 'Fermer le dossier', save: 'Enregistrer', saveAs: 'Enregistrer sous...',
        closeTab: 'Fermer l\'onglet',
    },
    build: { compile: 'Compiler', serverManager: 'Gestionnaire de serveur', configEditor: 'Éditeur de configuration' },
    preferences: 'Préférences',
    window: {
        minimize: 'Réduire', maximize: 'Agrandir', close: 'Fermer',
        unsavedChangesConfirm: (count) => `${count} fichier(s) ont des modifications non enregistrées. Fermer quand même ?`,
    },
    toolbar: { new: 'Nouveau', open: 'Ouvrir', save: 'Enregistrer', compile: 'Compiler', server: 'Serveur', config: 'Configuration', settings: 'Paramètres' },
    welcome: {
        subtitle: 'Éditeur SA-MP PAWN', newFile: 'Nouveau fichier', openFile: 'Ouvrir un fichier',
        openFolder: 'Ouvrir un dossier', tip: 'Nouveau {ctrl_n}, ouvrir {ctrl_o}, compiler {f5}',
    },
    output: { title: 'SORTIE', clear: 'Effacer', expand: 'Développer', collapse: 'Réduire', placeholder: 'La sortie du compilateur apparaîtra ici…' },
    statusBar: { noFileOpen: 'Aucun fichier ouvert', line: 'Lg.', col: 'Col.', lines: 'lignes' },
    explorer: {
        open: 'Ouvrir', rename: 'Renommer', newFile: 'Nouveau fichier', newFolder: 'Nouveau dossier',
        copyPath: 'Copier le chemin', copyRelativePath: 'Copier le chemin relatif', delete: 'Supprimer',
        cancel: 'Annuler', deleteConfirm: (name) => `Supprimer « ${name} » ?`,
        renamePlaceholder: 'Nouveau nom…', newFilePlaceholder: 'Nom du fichier (ex. script.pwn)', newFolderPlaceholder: 'Nom du dossier…',
    },
    tabs: {
        close: 'Fermer', closeSaved: 'Fermer les enregistrés', closeOthers: 'Fermer les autres',
        closeToRight: 'Fermer à droite', closeAll: 'Tout fermer',
        copyPath: 'Copier le chemin', copyRelativePath: 'Copier le chemin relatif',
        unsavedConfirm: (name) => `« ${name} » n'est pas enregistré. Fermer quand même ?`,
    },
    settingsModal: {
        title: 'Paramètres', compiler: 'Compilateur', compilerPath: 'Chemin du compilateur',
        includePaths: 'Chemins d\'inclusion', addPath: 'Ajouter un chemin', remove: 'Supprimer', browse: 'Parcourir',
        editor: 'Éditeur', fontSize: 'Taille de police', minimap: 'Minimap', wordWrap: 'Retour à la ligne',
        autoSave: 'Sauvegarde auto', autoSaveDelay: 'Délai (ms)', integration: 'Intégration',
        discordRPC: 'Discord RPC', language: 'Langue', cancel: 'Annuler', saveChanges: 'Enregistrer',
        savedSuccess: 'Paramètres enregistrés.', selectCompiler: 'Choisir le compilateur', selectFolder: 'Choisir un dossier', executables: 'Exécutables',
    },
    serverModal: {
        title: 'Serveur', serverControl: 'Contrôle du serveur', notDetected: 'Serveur non détecté',
        online: 'En ligne', offline: 'Hors ligne', startServer: 'Démarrer', stop: 'Arrêter',
        restart: 'Redémarrer', changePath: 'Modifier le chemin', consoleOutput: 'Sortie console',
        clear: 'Effacer', waitingForLogs: 'En attente des journaux…', close: 'Fermer',
        failedToStart: (err) => `Échec du démarrage : ${err}`, selectServer: 'Choisir le serveur', executables: 'Exécutables',
    },
    encodingPicker: { placeholder: 'Encodage…', noResults: 'Aucun résultat', encodingSet: (enc) => `Encodage : ${enc}` },
    configModal: {
        title: 'Configuration', configFile: 'Fichier de configuration', noneSelected: 'Aucun sélectionné',
        browse: 'Parcourir', key: 'Clé', value: 'Valeur', addRow: 'Ajouter une ligne',
        cancel: 'Annuler', saveConfig: 'Enregistrer la configuration', saved: 'Enregistré.',
        selectConfig: 'Choisir un fichier', configFiles: 'Fichiers de configuration',
        errorLoading: (err) => `Erreur de chargement : ${err}`, errorSaving: (err) => `Erreur d\'enregistrement : ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `Chemin copié : ${path}`, copiedRelative: (p) => `Chemin relatif copié : ${p}`,
        errorRenaming: (err) => `Erreur de renommage : ${err}`, errorCreatingFile: (err) => `Erreur de création : ${err}`,
        errorCreatingFolder: (err) => `Erreur de création de dossier : ${err}`, errorDeleting: (err) => `Erreur de suppression : ${err}`,
        fileTooLarge: 'Fichier trop volumineux.', fileIsBinary: 'Le fichier est binaire.',
    },
    sidebar: {
        explorer: 'EXPLORATEUR', noFolderOpen: 'Aucun dossier ouvert', openFolder: 'Ouvrir un dossier',
        newFilePlaceholder: 'Nom du fichier (ex. script.pwn)', newFolderPlaceholder: 'Nom du dossier…',
        newFile: 'Nouveau fichier', newFolder: 'Nouveau dossier', refresh: 'Actualiser', closeFolder: 'Fermer le dossier',
    },
    sourceControl: {
        title: 'CONTRÔLE DE CODE SOURCE', noFolderOpen: 'Aucun dossier ouvert.', notGitRepo: 'Le dossier n\'est pas un dépôt Git.',
        initRepo: 'Initialiser le dépôt', stagedChanges: 'Modifications indexées', changes: 'Modifications',
        untrackedFiles: 'Fichiers non suivis', commits: 'Commits', noChanges: 'Aucune modification',
        noCommitsYet: 'Aucun commit pour l\'instant.', commitPlaceholder: 'Message (Ctrl+Entrée pour commiter)', commit: 'Commiter',
        pull: 'Pull', push: 'Push', stageAll: 'Indexer tout', stash: 'Stash', stashPop: 'Stash Pop',
        refresh: 'Actualiser', unstageAll: 'Désindexer tout', stageAllChanges: 'Indexer toutes les modifications',
        stageAllUntracked: 'Indexer les fichiers non suivis', openChanges: 'Ouvrir les modifications',
        openFile: 'Ouvrir le fichier', openFileHead: 'Ouvrir le fichier (HEAD)', discardChanges: 'Annuler les modifications',
        stageChanges: 'Indexer les modifications', unstageChanges: 'Désindexer',
        addToGitignore: 'Ajouter à .gitignore', revealInFileExplorer: 'Afficher dans l\'explorateur',
        revealInExplorerView: 'Afficher dans la vue explorateur', pulling: 'Récupération...', pushing: 'Envoi...',
        outgoing: 'Sortants', incoming: 'Entrants', commitDetails: 'Détails du commit',
        couldNotLoad: 'Impossible de charger les détails.', pushPending: 'Push en attente', pullPending: 'Pull en attente',
    },
};

export default fr;
