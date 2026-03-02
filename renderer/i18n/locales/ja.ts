import type { Locale } from './en';

const ja: Locale = {
    menu: { file: 'ファイル', build: 'ビルド', settings: '設定' },
    file: {
        newFile: '新しいファイル', openFile: 'ファイルを開く...', openFolder: 'フォルダーを開く...',
        closeFolder: 'フォルダーを閉じる', save: '保存', saveAs: '名前を付けて保存...',
        closeTab: 'タブを閉じる',
    },
    build: { compile: 'コンパイル', serverManager: 'サーバーマネージャー', configEditor: '設定エディター' },
    preferences: '基本設定',
    window: {
        minimize: '最小化', maximize: '最大化', close: '閉じる',
        unsavedChangesConfirm: (count) => `${count} 個のファイルに未保存の変更があります。閉じてもよいですか？`,
    },
    toolbar: { new: '新規', open: '開く', save: '保存', compile: 'コンパイル', server: 'サーバー', config: '構成', settings: '設定' },
    welcome: {
        subtitle: 'SA-MP PAWN エディター', newFile: '新しいファイル', openFile: 'ファイルを開く',
        openFolder: 'フォルダーを開く', tip: '新規 {ctrl_n}、開く {ctrl_o}、コンパイル {f5}',
    },
    output: { title: '出力', clear: 'クリア', expand: '展開', collapse: '折りたたむ', placeholder: 'コンパイラの出力がここに表示されます…' },
    statusBar: { noFileOpen: 'ファイルを開いていません', line: '行', col: '列', lines: '行' },
    explorer: {
        open: '開く', rename: '名前の変更', newFile: '新しいファイル', newFolder: '新しいフォルダー',
        copyPath: 'パスをコピー', copyRelativePath: '相対パスをコピー', delete: '削除',
        cancel: 'キャンセル', deleteConfirm: (name) => `「${name}」を削除しますか？`,
        renamePlaceholder: '新しい名前…', newFilePlaceholder: 'ファイル名（例：script.pwn）', newFolderPlaceholder: 'フォルダー名…',
    },
    tabs: {
        close: '閉じる', closeSaved: '保存済みを閉じる', closeOthers: '他を閉じる',
        closeToRight: '右を閉じる', closeAll: 'すべて閉じる',
        copyPath: 'パスをコピー', copyRelativePath: '相対パスをコピー',
        unsavedConfirm: (name) => `「${name}」は保存されていません。閉じてもよいですか？`,
    },
    settingsModal: {
        title: '設定', compiler: 'コンパイラ', compilerPath: 'コンパイラのパス',
        includePaths: 'インクルードパス', addPath: 'パスを追加', remove: '削除', browse: '参照',
        editor: 'エディター', fontSize: 'フォントサイズ', minimap: 'ミニマップ', wordWrap: '折り返し',
        autoSave: '自動保存', autoSaveDelay: '遅延（ms）', integration: '統合',
        discordRPC: 'Discord RPC', language: '言語', cancel: 'キャンセル', saveChanges: '変更を保存',
        savedSuccess: '設定を保存しました。', selectCompiler: 'コンパイラを選択', selectFolder: 'フォルダーを選択', executables: '実行ファイル',
    },
    serverModal: {
        title: 'サーバー', serverControl: 'サーバーコントロール', notDetected: 'サーバーが見つかりません',
        online: 'オンライン', offline: 'オフライン', startServer: '起動', stop: '停止',
        restart: '再起動', changePath: 'パスを変更', consoleOutput: 'コンソール出力',
        clear: 'クリア', waitingForLogs: 'ログを待機中…', close: '閉じる',
        failedToStart: (err) => `起動に失敗: ${err}`, selectServer: 'サーバーを選択', executables: '実行ファイル',
    },
    encodingPicker: { placeholder: 'エンコード…', noResults: '結果なし', encodingSet: (enc) => `エンコード: ${enc}` },
    configModal: {
        title: '構成', configFile: '構成ファイル', noneSelected: '未選択',
        browse: '参照', key: 'キー', value: '値', addRow: '行を追加',
        cancel: 'キャンセル', saveConfig: '構成を保存', saved: '保存しました。',
        selectConfig: 'ファイルを選択', configFiles: '構成ファイル',
        errorLoading: (err) => `読み込みエラー: ${err}`, errorSaving: (err) => `保存エラー: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `パスをコピーしました: ${path}`, copiedRelative: (p) => `相対パスをコピーしました: ${p}`,
        errorRenaming: (err) => `名前変更エラー: ${err}`, errorCreatingFile: (err) => `ファイル作成エラー: ${err}`,
        errorCreatingFolder: (err) => `フォルダー作成エラー: ${err}`, errorDeleting: (err) => `削除エラー: ${err}`,
        fileTooLarge: 'ファイルが大きすぎます。', fileIsBinary: 'バイナリファイルです。',
    },
    sidebar: {
        explorer: 'エクスプローラー', noFolderOpen: 'フォルダーが開いていません', openFolder: 'フォルダーを開く',
        newFilePlaceholder: 'ファイル名（例：script.pwn）', newFolderPlaceholder: 'フォルダー名…',
        newFile: '新しいファイル', newFolder: '新しいフォルダー', refresh: '更新', closeFolder: 'フォルダーを閉じる',
    },
    sourceControl: {
        title: 'ソース管理', noFolderOpen: 'フォルダーが開いていません。', notGitRepo: 'このフォルダーは Git リポジトリではありません。',
        initRepo: 'リポジトリを初期化', stagedChanges: 'ステージされた変更', changes: '変更',
        untrackedFiles: '追跡されていないファイル', commits: 'コミット', noChanges: '変更なし',
        noCommitsYet: 'コミットはまだありません。', commitPlaceholder: 'メッセージ（Ctrl+Enter でコミット）', commit: 'コミット',
        pull: 'プル', push: 'プッシュ', stageAll: 'すべてステージ', stash: 'スタッシュ', stashPop: 'スタッシュポップ',
        refresh: '更新', unstageAll: 'すべてアンステージ', stageAllChanges: 'すべての変更をステージ',
        stageAllUntracked: '追跡されていないファイルをステージ', openChanges: '変更を開く',
        openFile: 'ファイルを開く', openFileHead: 'ファイルを開く (HEAD)', discardChanges: '変更を破棄',
        stageChanges: '変更をステージ', unstageChanges: 'ステージを解除',
        addToGitignore: '.gitignore に追加', removeFromGitignore: '.gitignore から削除', revealInFileExplorer: 'エクスプローラーで表示',
        revealInExplorerView: 'エクスプローラービューで表示', pulling: 'プル中...', pushing: 'プッシュ中...',
        outgoing: '送信中', incoming: '受信中', commitDetails: 'コミットの詳細',
        couldNotLoad: '詳細を読み込めませんでした。', pushPending: 'プッシュ待機中', pullPending: 'プル待機中',
    },
};

export default ja;
