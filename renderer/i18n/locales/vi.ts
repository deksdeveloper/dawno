import type { Locale } from './en';

const vi: Locale = {
    menu: { file: 'Tệp', build: 'Biên dịch', settings: 'Cài đặt' },
    file: {
        newFile: 'Tệp mới', openFile: 'Mở tệp...', openFolder: 'Mở thư mục...',
        closeFolder: 'Đóng thư mục', save: 'Lưu', saveAs: 'Lưu thành...',
        closeTab: 'Đóng tab',
    },
    build: { compile: 'Biên dịch', serverManager: 'Quản lý máy chủ', configEditor: 'Trình chỉnh sửa cấu hình' },
    preferences: 'Tùy chọn',
    window: {
        minimize: 'Thu nhỏ', maximize: 'Phóng to', close: 'Đóng',
        unsavedChangesConfirm: (count) => `${count} tệp có thay đổi chưa lưu. Vẫn đóng?`,
    },
    toolbar: { new: 'Mới', open: 'Mở', save: 'Lưu', compile: 'Biên dịch', server: 'Máy chủ', config: 'Cấu hình', settings: 'Cài đặt' },
    welcome: {
        subtitle: 'Trình chỉnh sửa SA-MP PAWN', newFile: 'Tệp mới', openFile: 'Mở tệp',
        openFolder: 'Mở thư mục', tip: 'Tệp mới {ctrl_n}, mở {ctrl_o}, biên dịch {f5}',
    },
    output: { title: 'ĐẦU RA', clear: 'Xóa', expand: 'Mở rộng', collapse: 'Thu gọn', placeholder: 'Đầu ra trình biên dịch sẽ hiển thị ở đây…' },
    statusBar: { noFileOpen: 'Chưa mở tệp', line: 'Dòng', col: 'Cột', lines: 'dòng' },
    explorer: {
        open: 'Mở', rename: 'Đổi tên', newFile: 'Tệp mới', newFolder: 'Thư mục mới',
        copyPath: 'Sao chép đường dẫn', copyRelativePath: 'Sao chép đường dẫn tương đối', delete: 'Xóa',
        cancel: 'Hủy', deleteConfirm: (name) => `Xóa «${name}»?`,
        renamePlaceholder: 'Tên mới…', newFilePlaceholder: 'Tên tệp (vd. script.pwn)', newFolderPlaceholder: 'Tên thư mục…',
    },
    tabs: {
        close: 'Đóng', closeSaved: 'Đóng đã lưu', closeOthers: 'Đóng khác',
        closeToRight: 'Đóng bên phải', closeAll: 'Đóng tất cả',
        copyPath: 'Sao chép đường dẫn', copyRelativePath: 'Sao chép đường dẫn tương đối',
        unsavedConfirm: (name) => `«${name}» chưa được lưu. Vẫn đóng?`,
    },
    settingsModal: {
        title: 'Cài đặt', compiler: 'Trình biên dịch', compilerPath: 'Đường dẫn trình biên dịch',
        includePaths: 'Đường dẫn include', addPath: 'Thêm đường dẫn', remove: 'Xóa', browse: 'Duyệt',
        editor: 'Trình chỉnh sửa', fontSize: 'Cỡ chữ', minimap: 'Sơ đồ thu nhỏ', wordWrap: 'Ngắt dòng',
        autoSave: 'Tự động lưu', autoSaveDelay: 'Độ trễ (ms)', integration: 'Tích hợp',
        discordRPC: 'Discord RPC', language: 'Ngôn ngữ', cancel: 'Hủy', saveChanges: 'Lưu thay đổi',
        savedSuccess: 'Đã lưu cài đặt.', selectCompiler: 'Chọn trình biên dịch', selectFolder: 'Chọn thư mục', executables: 'Tệp thực thi',
    },
    serverModal: {
        title: 'Máy chủ', serverControl: 'Điều khiển máy chủ', notDetected: 'Không phát hiện máy chủ',
        online: 'Trực tuyến', offline: 'Ngoại tuyến', startServer: 'Khởi động', stop: 'Dừng',
        restart: 'Khởi động lại', changePath: 'Đổi đường dẫn', consoleOutput: 'Đầu ra console',
        clear: 'Xóa', waitingForLogs: 'Đang chờ nhật ký…', close: 'Đóng',
        failedToStart: (err) => `Khởi động thất bại: ${err}`, selectServer: 'Chọn máy chủ', executables: 'Tệp thực thi',
    },
    encodingPicker: { placeholder: 'Mã hóa…', noResults: 'Không có kết quả', encodingSet: (enc) => `Mã hóa: ${enc}` },
    configModal: {
        title: 'Cấu hình', configFile: 'Tệp cấu hình', noneSelected: 'Chưa chọn',
        browse: 'Duyệt', key: 'Khóa', value: 'Giá trị', addRow: 'Thêm dòng',
        cancel: 'Hủy', saveConfig: 'Lưu cấu hình', saved: 'Đã lưu.',
        selectConfig: 'Chọn tệp', configFiles: 'Tệp cấu hình',
        errorLoading: (err) => `Lỗi tải: ${err}`, errorSaving: (err) => `Lỗi lưu: ${err}`,
    },
    output_msgs: {
        copiedPath: (path) => `Đã sao chép đường dẫn: ${path}`, copiedRelative: (p) => `Đã sao chép đường dẫn tương đối: ${p}`,
        errorRenaming: (err) => `Lỗi đổi tên: ${err}`, errorCreatingFile: (err) => `Lỗi tạo tệp: ${err}`,
        errorCreatingFolder: (err) => `Lỗi tạo thư mục: ${err}`, errorDeleting: (err) => `Lỗi xóa: ${err}`,
        fileTooLarge: 'Tệp quá lớn.', fileIsBinary: 'Tệp là nhị phân.',
    },
    sidebar: {
        explorer: 'TRÌNH KHÁM PHÁ', noFolderOpen: 'Chưa mở thư mục', openFolder: 'Mở thư mục',
        newFilePlaceholder: 'Tên tệp (vd. script.pwn)', newFolderPlaceholder: 'Tên thư mục…',
        newFile: 'Tệp mới', newFolder: 'Thư mục mới', refresh: 'Làm mới', closeFolder: 'Đóng thư mục',
    },
    sourceControl: {
        title: 'QUẢN LÝ NGUỒN', noFolderOpen: 'Chưa mở thư mục.', notGitRepo: 'Thư mục không phải kho Git.',
        initRepo: 'Khởi tạo kho', stagedChanges: 'Thay đổi đã chỉ định', changes: 'Thay đổi',
        untrackedFiles: 'Tệp chưa theo dõi', commits: 'Cam kết', noChanges: 'Không có thay đổi',
        noCommitsYet: 'Chưa có cam kết.', commitPlaceholder: 'Thông điệp (Ctrl+Enter để cam kết)', commit: 'Cam kết',
        pull: 'Kéo', push: 'Đẩy', stageAll: 'Chỉ định tất cả', stash: 'Stash', stashPop: 'Stash Pop',
        refresh: 'Làm mới', unstageAll: 'Hủy chỉ định tất cả', stageAllChanges: 'Chỉ định tất cả thay đổi',
        stageAllUntracked: 'Chỉ định tệp chưa theo dõi', openChanges: 'Mở thay đổi',
        openFile: 'Mở tệp', openFileHead: 'Mở tệp (HEAD)', discardChanges: 'Hủy thay đổi',
        stageChanges: 'Chỉ định thay đổi', unstageChanges: 'Hủy chỉ định',
        addToGitignore: 'Thêm vào .gitignore', revealInFileExplorer: 'Hiện trong trình khám phá',
        revealInExplorerView: 'Hiện trong chế độ xem', pulling: 'Đang kéo...', pushing: 'Đang đẩy...',
        outgoing: 'Gửi đi', incoming: 'Nhận về', commitDetails: 'Chi tiết cam kết',
        couldNotLoad: 'Không thể tải chi tiết.', pushPending: 'Chờ đẩy', pullPending: 'Chờ kéo',
    },
};

export default vi;
