


export { };

declare global {
    interface Window {
        api: {
            
            minimize(): void;
            maximize(): void;
            close(): void;
            onWindowStateChange(cb: (state: 'maximized' | 'normal') => void): void;

            
            openFile(encoding: string): Promise<Array<{ path: string; content: string }> | null>;
            saveFile(data: { filePath: string | null; content: string; encoding: string }): Promise<string | null>;
            readFile(filePath: string, encoding: string): Promise<{ content: string | null; error: string | null }>;

            
            compileFile(data: { filePath: string; compilerPath: string; includePaths: string[] }): Promise<{ success: boolean; output: string; code?: number }>;

            
            getSettings(): Promise<AppSettings>;
            saveSettings(s: Partial<AppSettings>): Promise<AppSettings>;
            browseForFile(opts: { title: string; filters: Array<{ name: string; extensions: string[] }> }): Promise<string | null>;
            browseForFolder(): Promise<string | null>;
            openFolderDialog(): Promise<string | null>;
            readDirectory(dirPath: string): Promise<Array<{ name: string; path: string; isDirectory: boolean }> | null>;
            getProjectConfig(folderPath: string): Promise<ProjectConfig | null>;
            saveProjectConfig(data: { folderPath: string; config: ProjectConfig }): Promise<boolean>;

            
            copyFile(data: { src: string; dest: string }): Promise<{ success: boolean; error?: string }>;
            moveFile(data: { src: string; dest: string }): Promise<{ success: boolean; error?: string }>;
            deleteFile(filePath: string): Promise<{ success: boolean; error?: string }>;
            exists(filePath: string): Promise<boolean>;
            getStats(filePath: string): Promise<{ exists: boolean; isDirectory?: boolean; isFile?: boolean; size?: number }>;

            
            updateRPC(data: object): void;
            toggleRPC(enabled: boolean): void;

            
            onFolderChange(cb: (data: { eventType: string; filename: string }) => void): void;

            
            findPawncc(folderPath: string): Promise<string | null>;

            
            detectServer(folderPath: string): Promise<{ path: string; type: 'omp' | 'samp' } | null>;
            startServer(serverPath: string): Promise<{ success: boolean; error?: string }>;
            stopServer(): Promise<{ success: boolean; error?: string }>;
            restartServer(serverPath: string): Promise<{ success: boolean; error?: string }>;
            getServerStatus(): Promise<{ running: boolean }>;
            onServerLog(cb: (data: { type: 'out' | 'err' | 'info'; text: string }) => void): void;
            onServerStatusChange(cb: (running: boolean) => void): void;

            
            detectConfig(folderPath: string): Promise<string | null>;
            readConfigFile(filePath: string): Promise<{ success: boolean; type?: 'json' | 'cfg'; data?: Record<string, unknown>; raw?: string; error?: string }>;
            writeConfigFile(filePath: string, data: Record<string, unknown>, type: 'json' | 'cfg'): Promise<{ success: boolean; error?: string }>;
        };
    }

    interface AppSettings {
        compilerPath: string;
        includePaths: string[];
        fontSize: number;
        theme: string;
        defaultEncoding?: string;
        discordRPC?: boolean;
    }

    interface ProjectConfig {
        encoding?: string;
        openTabs?: Array<{ path: string; cursor?: { lineNumber: number; column: number }; scroll?: number }>;
        activeTabPath?: string;
    }
}
