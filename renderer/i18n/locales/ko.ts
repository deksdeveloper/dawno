import type { Locale } from './en';

const ko: Locale = {
    menu: { file: '파일', build: '빌드', settings: '설정' },
    file: {
        newFile: '새 파일', openFile: '파일 열기...', openFolder: '폴더 열기...',
        closeFolder: '폴더 닫기', save: '저장', saveAs: '다른 이름으로 저장...',
        closeTab: '탭 닫기',
    },
    build: { compile: '컴파일', serverManager: '서버 관리자', configEditor: '구성 편집기' },
    preferences: '기본 설정',
    window: {
        minimize: '최소화', maximize: '최대화', close: '닫기',
        unsavedChangesConfirm: (count) => `${count}개 파일에 저장되지 않은 변경 사항이 있습니다. 닫으시겠습니까?`,
    },
    toolbar: { new: '새로 만들기', open: '열기', save: '저장', compile: '컴파일', server: '서버', config: '구성', settings: '설정' },
    welcome: {
        subtitle: 'SA-MP PAWN 편집기', newFile: '새 파일', openFile: '파일 열기',
        openFolder: '폴더 열기', tip: '새 파일 {ctrl_n}, 열기 {ctrl_o}, 컴파일 {f5}',
    },
    output: { title: '출력', clear: '지우기', expand: '확장', collapse: '축소', placeholder: '컴파일러 출력이 여기에 표시됩니다…' },
    statusBar: { noFileOpen: '열린 파일 없음', line: '줄', col: '열', lines: '줄' },
    explorer: {
        open: '열기', rename: '이름 바꾸기', newFile: '새 파일', newFolder: '새 폴더',
        copyPath: '경로 복사', copyRelativePath: '상대 경로 복사', delete: '삭제',
        cancel: '취소', deleteConfirm: (name) => `«${name}»을(를) 삭제하시겠습니까?`,
        renamePlaceholder: '새 이름…', newFilePlaceholder: '파일 이름 (예: script.pwn)', newFolderPlaceholder: '폴더 이름…',
    },
    tabs: {
        close: '닫기', closeSaved: '저장된 항목 닫기', closeOthers: '다른 항목 닫기',
        closeToRight: '오른쪽 닫기', closeAll: '모두 닫기',
        copyPath: '경로 복사', copyRelativePath: '상대 경로 복사',
        unsavedConfirm: (name) => `«${name}»은(는) 저장되지 않았습니다. 닫으시겠습니까?`,
    },
    settingsModal: {
        title: '설정', compiler: '컴파일러', compilerPath: '컴파일러 경로',
        includePaths: '포함 경로', addPath: '경로 추가', remove: '제거', browse: '찾아보기',
        editor: '편집기', fontSize: '글꼴 크기', minimap: '미니맵', wordWrap: '줄 바꿈',
        autoSave: '자동 저장', autoSaveDelay: '지연 (ms)', integration: '통합',
        discordRPC: 'Discord RPC', language: '언어', cancel: '취소', saveChanges: '변경 사항 저장',
        savedSuccess: '설정이 저장되었습니다.', selectCompiler: '컴파일러 선택', selectFolder: '폴더 선택', executables: '실행 파일',
    },
    serverModal: {
        title: '서버', serverControl: '서버 제어', notDetected: '서버를 찾을 수 없습니다',
        online: '온라인', offline: '오프라인', startServer: '시작', stop: '중지',
        restart: '다시 시작', changePath: '경로 변경', consoleOutput: '콘솔 출력',
        clear: '지우기', waitingForLogs: '로그 대기 중…', close: '닫기',
        failedToStart: (err) => `시작 실패: ${err}`, selectServer: '서버 선택', executables: '실행 파일',
    },
    encodingPicker: { placeholder: '인코딩…', noResults: '결과 없음', encodingSet: (enc) => `인코딩: ${enc}` },
    configModal: {
        title: '구성', configFile: '구성 파일', noneSelected: '선택 없음',
        browse: '찾아보기', key: '키', value: '값', addRow: '행 추가',
        cancel: '취소', saveConfig: '구성 저장', saved: '저장되었습니다.',
        selectConfig: '파일 선택', configFiles: '구성 파일',
        errorLoading: (err) => `로드 오류: ${err}`, errorSaving: (err) => `저장 오류: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `경로 복사됨: ${path}`, copiedRelative: (p) => `상대 경로 복사됨: ${p}`,
        errorRenaming: (err) => `이름 바꾸기 오류: ${err}`, errorCreatingFile: (err) => `파일 생성 오류: ${err}`,
        errorCreatingFolder: (err) => `폴더 생성 오류: ${err}`, errorDeleting: (err) => `삭제 오류: ${err}`,
        fileTooLarge: '파일이 너무 큽니다.', fileIsBinary: '파일이 바이너리입니다.',
    },
    sidebar: {
        explorer: '탐색기', noFolderOpen: '열린 폴더 없음', openFolder: '폴더 열기',
        newFilePlaceholder: '파일 이름 (예: script.pwn)', newFolderPlaceholder: '폴더 이름…',
        newFile: '새 파일', newFolder: '새 폴더', refresh: '새로 고침', closeFolder: '폴더 닫기',
    },
    sourceControl: {
        title: '소스 제어', noFolderOpen: '열린 폴더 없음.', notGitRepo: '현재 폴더가 Git 저장소가 아닙니다.',
        initRepo: '저장소 초기화', stagedChanges: '스테이징된 변경 사항', changes: '변경 사항',
        untrackedFiles: '추적되지 않은 파일', commits: '커밋', noChanges: '변경 사항 없음',
        noCommitsYet: '아직 커밋이 없습니다.', commitPlaceholder: '메시지 (Ctrl+Enter로 커밋)', commit: '커밋',
        pull: '풀', push: '푸시', stageAll: '모두 스테이징', stash: '스태시', stashPop: '스태시 팝',
        refresh: '새로 고침', unstageAll: '모두 언스테이징', stageAllChanges: '모든 변경 사항 스테이징',
        stageAllUntracked: '추적되지 않은 파일 스테이징', openChanges: '변경 사항 열기',
        openFile: '파일 열기', openFileHead: '파일 열기 (HEAD)', discardChanges: '변경 사항 취소',
        stageChanges: '변경 사항 스테이징', unstageChanges: '언스테이징',
        addToGitignore: '.gitignore에 추가', removeFromGitignore: '.gitignore에서 제거', revealInFileExplorer: '파일 탐색기에서 표시',
        revealInExplorerView: '탐색기 보기에서 표시', pulling: '풀 중...', pushing: '푸시 중...',
        outgoing: '발신', incoming: '수신', commitDetails: '커밋 세부 정보',
        couldNotLoad: '세부 정보를 로드할 수 없습니다.', pushPending: '푸시 대기 중', pullPending: '풀 대기 중',
    },
};

export default ko;
