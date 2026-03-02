import type { Locale } from './en';

const es: Locale = {
    menu: { file: 'Archivo', build: 'Compilar', settings: 'Configuración' },
    file: {
        newFile: 'Nuevo archivo', openFile: 'Abrir archivo...', openFolder: 'Abrir carpeta...',
        closeFolder: 'Cerrar carpeta', save: 'Guardar', saveAs: 'Guardar como...',
        closeTab: 'Cerrar pestaña',
    },
    build: { compile: 'Compilar', serverManager: 'Administrador de servidor', configEditor: 'Editor de configuración' },
    preferences: 'Preferencias',
    window: {
        minimize: 'Minimizar', maximize: 'Maximizar', close: 'Cerrar',
        unsavedChangesConfirm: (count) => `Hay cambios sin guardar en ${count} archivos. ¿Cerrar de todas formas?`,
    },
    toolbar: { new: 'Nuevo', open: 'Abrir', save: 'Guardar', compile: 'Compilar', server: 'Servidor', config: 'Configuración', settings: 'Configuración' },
    welcome: {
        subtitle: 'Editor SA-MP PAWN', newFile: 'Nuevo archivo', openFile: 'Abrir archivo',
        openFolder: 'Abrir carpeta', tip: 'Nuevo {ctrl_n}, abrir {ctrl_o}, compilar {f5}',
    },
    output: { title: 'SALIDA', clear: 'Limpiar', expand: 'Expandir', collapse: 'Colapsar', placeholder: 'La salida del compilador aparecerá aquí…' },
    statusBar: { noFileOpen: 'Sin archivo abierto', line: 'Lín.', col: 'Col.', lines: 'líneas' },
    explorer: {
        open: 'Abrir', rename: 'Renombrar', newFile: 'Nuevo archivo', newFolder: 'Nueva carpeta',
        copyPath: 'Copiar ruta', copyRelativePath: 'Copiar ruta relativa', delete: 'Eliminar',
        cancel: 'Cancelar', deleteConfirm: (name) => `¿Eliminar «${name}»?`,
        renamePlaceholder: 'Nuevo nombre…', newFilePlaceholder: 'Nombre del archivo (ej. script.pwn)', newFolderPlaceholder: 'Nombre de carpeta…',
    },
    tabs: {
        close: 'Cerrar', closeSaved: 'Cerrar guardados', closeOthers: 'Cerrar otros',
        closeToRight: 'Cerrar a la derecha', closeAll: 'Cerrar todos',
        copyPath: 'Copiar ruta', copyRelativePath: 'Copiar ruta relativa',
        unsavedConfirm: (name) => `«${name}» no está guardado. ¿Cerrar de todas formas?`,
    },
    settingsModal: {
        title: 'Configuración', compiler: 'Compilador', compilerPath: 'Ruta del compilador',
        includePaths: 'Rutas de inclusión', addPath: 'Añadir ruta', remove: 'Eliminar', browse: 'Explorar',
        editor: 'Editor', fontSize: 'Tamaño de fuente', minimap: 'Minimapa', wordWrap: 'Ajuste de línea',
        autoSave: 'Autoguardado', autoSaveDelay: 'Retraso (ms)', integration: 'Integración',
        discordRPC: 'Discord RPC', language: 'Idioma', cancel: 'Cancelar', saveChanges: 'Guardar cambios',
        savedSuccess: 'Configuración guardada.', selectCompiler: 'Seleccionar compilador', selectFolder: 'Seleccionar carpeta', executables: 'Ejecutables',
    },
    serverModal: {
        title: 'Servidor', serverControl: 'Control del servidor', notDetected: 'Servidor no detectado',
        online: 'En línea', offline: 'Desconectado', startServer: 'Iniciar', stop: 'Detener',
        restart: 'Reiniciar', changePath: 'Cambiar ruta', consoleOutput: 'Salida de consola',
        clear: 'Limpiar', waitingForLogs: 'Esperando registros…', close: 'Cerrar',
        failedToStart: (err) => `Error al iniciar: ${err}`, selectServer: 'Seleccionar servidor', executables: 'Ejecutables',
    },
    encodingPicker: { placeholder: 'Codificación…', noResults: 'Sin resultados', encodingSet: (enc) => `Codificación: ${enc}` },
    configModal: {
        title: 'Configuración', configFile: 'Archivo de configuración', noneSelected: 'Ninguno seleccionado',
        browse: 'Explorar', key: 'Clave', value: 'Valor', addRow: 'Añadir fila',
        cancel: 'Cancelar', saveConfig: 'Guardar configuración', saved: 'Guardado.',
        selectConfig: 'Seleccionar archivo', configFiles: 'Archivos de configuración',
        errorLoading: (err) => `Error al cargar: ${err}`, errorSaving: (err) => `Error al guardar: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `Ruta copiada: ${path}`, copiedRelative: (p) => `Ruta relativa copiada: ${p}`,
        errorRenaming: (err) => `Error al renombrar: ${err}`, errorCreatingFile: (err) => `Error al crear archivo: ${err}`,
        errorCreatingFolder: (err) => `Error al crear carpeta: ${err}`, errorDeleting: (err) => `Error al eliminar: ${err}`,
        fileTooLarge: 'Archivo demasiado grande.', fileIsBinary: 'El archivo es binario.',
    },
    sidebar: {
        explorer: 'EXPLORADOR', noFolderOpen: 'No hay carpeta abierta', openFolder: 'Abrir carpeta',
        newFilePlaceholder: 'Nombre de archivo (ej. script.pwn)', newFolderPlaceholder: 'Nombre de carpeta…',
        newFile: 'Nuevo archivo', newFolder: 'Nueva carpeta', refresh: 'Actualizar', closeFolder: 'Cerrar carpeta',
    },
    sourceControl: {
        title: 'CONTROL DE CÓDIGO FUENTE', noFolderOpen: 'No hay carpeta abierta.', notGitRepo: 'La carpeta no es un repositorio Git.',
        initRepo: 'Inicializar repositorio', stagedChanges: 'Cambios preparados', changes: 'Cambios',
        untrackedFiles: 'Archivos sin seguimiento', commits: 'Confirmaciones', noChanges: 'Sin cambios',
        noCommitsYet: 'Aún no hay confirmaciones.', commitPlaceholder: 'Mensaje (Ctrl+Enter para confirmar)', commit: 'Confirmar',
        pull: 'Pull', push: 'Push', stageAll: 'Preparar todo', stash: 'Stash', stashPop: 'Stash Pop',
        refresh: 'Actualizar', unstageAll: 'Desprepara todo', stageAllChanges: 'Preparar todos los cambios',
        stageAllUntracked: 'Preparar sin seguimiento', openChanges: 'Abrir cambios', openFile: 'Abrir archivo',
        openFileHead: 'Abrir archivo (HEAD)', discardChanges: 'Descartar cambios', stageChanges: 'Preparar cambios',
        unstageChanges: 'Desprepara cambios', addToGitignore: 'Añadir a .gitignore',
        revealInFileExplorer: 'Mostrar en explorador', revealInExplorerView: 'Mostrar en vista del explorador',
        pulling: 'Obteniendo...', pushing: 'Enviando...',
        outgoing: 'Salientes', incoming: 'Entrantes', commitDetails: 'Detalles del commit',
        couldNotLoad: 'No se pudieron cargar los detalles.', pushPending: 'Push pendiente', pullPending: 'Pull pendiente',
    },
};

export default es;
