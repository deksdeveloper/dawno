import type { Locale } from './en';

const pt: Locale = {
    menu: { file: 'Arquivo', build: 'Compilar', settings: 'Configurações' },
    file: {
        newFile: 'Novo arquivo', openFile: 'Abrir arquivo...', openFolder: 'Abrir pasta...',
        closeFolder: 'Fechar pasta', save: 'Salvar', saveAs: 'Salvar como...',
        closeTab: 'Fechar aba',
    },
    build: { compile: 'Compilar', serverManager: 'Gerenciador de servidor', configEditor: 'Editor de configuração' },
    preferences: 'Preferências',
    window: {
        minimize: 'Minimizar', maximize: 'Maximizar', close: 'Fechar',
        unsavedChangesConfirm: (count) => `${count} arquivo(s) têm alterações não salvas. Fechar mesmo assim?`,
    },
    toolbar: { new: 'Novo', open: 'Abrir', save: 'Salvar', compile: 'Compilar', server: 'Servidor', config: 'Configuração', settings: 'Configurações' },
    welcome: {
        subtitle: 'Editor SA-MP PAWN', newFile: 'Novo arquivo', openFile: 'Abrir arquivo',
        openFolder: 'Abrir pasta', tip: 'Novo {ctrl_n}, abrir {ctrl_o}, compilar {f5}',
    },
    output: { title: 'SAÍDA', clear: 'Limpar', expand: 'Expandir', collapse: 'Recolher', placeholder: 'A saída do compilador aparecerá aqui…' },
    statusBar: { noFileOpen: 'Nenhum arquivo aberto', line: 'Ln.', col: 'Col.', lines: 'linhas' },
    explorer: {
        open: 'Abrir', rename: 'Renomear', newFile: 'Novo arquivo', newFolder: 'Nova pasta',
        copyPath: 'Copiar caminho', copyRelativePath: 'Copiar caminho relativo', delete: 'Excluir',
        cancel: 'Cancelar', deleteConfirm: (name) => `Excluir «${name}»?`,
        renamePlaceholder: 'Novo nome…', newFilePlaceholder: 'Nome do arquivo (ex. script.pwn)', newFolderPlaceholder: 'Nome da pasta…',
    },
    tabs: {
        close: 'Fechar', closeSaved: 'Fechar salvos', closeOthers: 'Fechar outros',
        closeToRight: 'Fechar à direita', closeAll: 'Fechar todos',
        copyPath: 'Copiar caminho', copyRelativePath: 'Copiar caminho relativo',
        unsavedConfirm: (name) => `«${name}» não está salvo. Fechar mesmo assim?`,
    },
    settingsModal: {
        title: 'Configurações', compiler: 'Compilador', compilerPath: 'Caminho do compilador',
        includePaths: 'Caminhos de inclusão', addPath: 'Adicionar caminho', remove: 'Remover', browse: 'Procurar',
        editor: 'Editor', fontSize: 'Tamanho da fonte', minimap: 'Minimapa', wordWrap: 'Quebra de linha',
        autoSave: 'Salvamento automático', autoSaveDelay: 'Atraso (ms)', integration: 'Integração',
        discordRPC: 'Discord RPC', language: 'Idioma', cancel: 'Cancelar', saveChanges: 'Salvar alterações',
        savedSuccess: 'Configurações salvas.', selectCompiler: 'Selecionar compilador', selectFolder: 'Selecionar pasta', executables: 'Executáveis',
    },
    serverModal: {
        title: 'Servidor', serverControl: 'Controle do servidor', notDetected: 'Servidor não detectado',
        online: 'Online', offline: 'Offline', startServer: 'Iniciar', stop: 'Parar',
        restart: 'Reiniciar', changePath: 'Alterar caminho', consoleOutput: 'Saída do console',
        clear: 'Limpar', waitingForLogs: 'Aguardando logs…', close: 'Fechar',
        failedToStart: (err) => `Falha ao iniciar: ${err}`, selectServer: 'Selecionar servidor', executables: 'Executáveis',
    },
    encodingPicker: { placeholder: 'Codificação…', noResults: 'Sem resultados', encodingSet: (enc) => `Codificação: ${enc}` },
    configModal: {
        title: 'Configuração', configFile: 'Arquivo de configuração', noneSelected: 'Nenhum selecionado',
        browse: 'Procurar', key: 'Chave', value: 'Valor', addRow: 'Adicionar linha',
        cancel: 'Cancelar', saveConfig: 'Salvar configuração', saved: 'Salvo.',
        selectConfig: 'Selecionar arquivo', configFiles: 'Arquivos de configuração',
        errorLoading: (err) => `Erro ao carregar: ${err}`, errorSaving: (err) => `Erro ao salvar: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `Caminho copiado: ${path}`, copiedRelative: (p) => `Caminho relativo copiado: ${p}`,
        errorRenaming: (err) => `Erro ao renomear: ${err}`, errorCreatingFile: (err) => `Erro ao criar arquivo: ${err}`,
        errorCreatingFolder: (err) => `Erro ao criar pasta: ${err}`, errorDeleting: (err) => `Erro ao excluir: ${err}`,
        fileTooLarge: 'Arquivo muito grande.', fileIsBinary: 'O arquivo é binário.',
    },
    sidebar: {
        explorer: 'EXPLORADOR', noFolderOpen: 'Nenhuma pasta aberta', openFolder: 'Abrir pasta',
        newFilePlaceholder: 'Nome do arquivo (ex. script.pwn)', newFolderPlaceholder: 'Nome da pasta…',
        newFile: 'Novo arquivo', newFolder: 'Nova pasta', refresh: 'Atualizar', closeFolder: 'Fechar pasta',
    },
    sourceControl: {
        title: 'CONTROLE DE CÓDIGO FONTE', noFolderOpen: 'Nenhuma pasta aberta.', notGitRepo: 'A pasta não é um repositório Git.',
        initRepo: 'Inicializar repositório', stagedChanges: 'Alterações preparadas', changes: 'Alterações',
        untrackedFiles: 'Arquivos não rastreados', commits: 'Commits', noChanges: 'Sem alterações',
        noCommitsYet: 'Nenhum commit ainda.', commitPlaceholder: 'Mensagem (Ctrl+Enter para commitar)', commit: 'Commitar',
        pull: 'Pull', push: 'Push', stageAll: 'Preparar tudo', stash: 'Stash', stashPop: 'Stash Pop',
        refresh: 'Atualizar', unstageAll: 'Remover tudo', stageAllChanges: 'Preparar todas as alterações',
        stageAllUntracked: 'Preparar não rastreados', openChanges: 'Abrir alterações',
        openFile: 'Abrir arquivo', openFileHead: 'Abrir arquivo (HEAD)', discardChanges: 'Descartar alterações',
        stageChanges: 'Preparar alterações', unstageChanges: 'Remover preparação',
        addToGitignore: 'Adicionar ao .gitignore', revealInFileExplorer: 'Revelar no explorador',
        revealInExplorerView: 'Revelar na vista do explorador', pulling: 'Obtendo...', pushing: 'Enviando...',
        outgoing: 'Saídas', incoming: 'Entradas', commitDetails: 'Detalhes do commit',
        couldNotLoad: 'Não foi possível carregar os detalhes.', pushPending: 'Push pendente', pullPending: 'Pull pendente',
    },
};

export default pt;
