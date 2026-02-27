'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import type * as MonacoType from 'monaco-editor';



export interface TabState {
    id: number;
    name: string;
    path: string | null;
    model: MonacoType.editor.ITextModel | null;
    dirty: boolean;
    cursor?: { lineNumber: number; column: number };
    scroll?: number;
    viewState?: MonacoType.editor.ICodeEditorViewState | null;
}

export interface OutputLine {
    id: number;
    text: string;
    type: 'info' | 'error' | 'warning' | 'success';
    clickable?: boolean;
    filePath?: string | null;
}

export interface EditorContextValue {

    tabs: TabState[];
    setTabs: React.Dispatch<React.SetStateAction<TabState[]>>;
    activeTabId: number | null;
    setActiveTabId: (id: number | null) => void;
    createTab: (name: string, path: string | null, content: string, state?: Partial<TabState>) => TabState | null;
    closeTab: (id: number) => void;
    updateTab: (id: number, changes: Partial<TabState>) => void;
    saveViewState: (id: number) => void;


    editorRef: React.MutableRefObject<MonacoType.editor.IStandaloneCodeEditor | null>;
    monacoRef: React.MutableRefObject<typeof MonacoType | null>;


    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;


    currentFolderPath: string | null;
    setCurrentFolderPath: (path: string | null) => void;


    currentEncoding: string;
    setCurrentEncoding: (enc: string) => void;


    outputLines: OutputLine[];
    appendOutput: (text: string, type?: OutputLine['type'], clickable?: boolean, filePath?: string | null) => void;
    clearOutput: () => void;
    outputCollapsed: boolean;
    setOutputCollapsed: (v: boolean) => void;


    detectedServerPath: string | null;
    setDetectedServerPath: (p: string | null) => void;
    detectedServerType: 'omp' | 'samp' | null;
    setDetectedServerType: (t: 'omp' | 'samp' | null) => void;
    detectedConfigPath: string | null;
    setDetectedConfigPath: (p: string | null) => void;
    serverRunning: boolean;
    setServerRunning: (v: boolean) => void;


    tabCounterRef: React.MutableRefObject<number>;
    isProgrammaticUpdate: React.MutableRefObject<boolean>;
}



const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [tabs, setTabs] = useState<TabState[]>([]);
    const [activeTabId, setActiveTabId] = useState<number | null>(null);
    const [settings, setSettings] = useState<AppSettings>({
        compilerPath: '',
        includePaths: [],
        fontSize: 14,
        theme: 'dark',
        defaultEncoding: 'utf-8',
        discordRPC: true,
    });
    const [currentFolderPath, setCurrentFolderPath] = useState<string | null>(null);
    const [currentEncoding, setCurrentEncoding] = useState('utf-8');
    const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
    const [outputCollapsed, setOutputCollapsed] = useState(false);
    const [detectedServerPath, setDetectedServerPath] = useState<string | null>(null);
    const [detectedServerType, setDetectedServerType] = useState<'omp' | 'samp' | null>(null);
    const [detectedConfigPath, setDetectedConfigPath] = useState<string | null>(null);
    const [serverRunning, setServerRunning] = useState(false);

    const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<typeof MonacoType | null>(null);
    const tabCounterRef = useRef(0);
    const isProgrammaticUpdate = useRef(false);
    const outputLineIdRef = useRef(0);


    useEffect(() => {
        if (typeof window === 'undefined') return;
        import('@monaco-editor/react').then(({ loader }) => {
            loader.init().then(m => {
                monacoRef.current = m;
            });
        });
    }, []);


    useEffect(() => {
        if (!window.api || !currentFolderPath) {
            setDetectedServerPath(null);
            setDetectedConfigPath(null);
            return;
        }

        window.api.detectServer(currentFolderPath).then(res => {
            if (res) {
                setDetectedServerPath(res.path);
                setDetectedServerType(res.type);
            }
        });

        window.api.detectConfig(currentFolderPath).then(path => {
            if (path) setDetectedConfigPath(path);
        });
    }, [currentFolderPath]);



    const createTab = useCallback(
        (name: string, path: string | null, content: string, state?: Partial<TabState>): TabState | null => {
            const monaco = monacoRef.current;
            if (!monaco) return null;

            tabCounterRef.current += 1;
            const id = tabCounterRef.current;
            const model = monaco.editor.createModel(content, 'pawn');
            const tab: TabState = { id, name, path, model, dirty: false, ...state };

            setTabs((prev) => [...prev, tab]);
            setActiveTabId(id);
            return tab;
        },
        []
    );

    const closeTab = useCallback((id: number) => {
        setTabs((prev) => {
            const idx = prev.findIndex((t) => t.id === id);
            if (idx === -1) return prev;
            const tab = prev[idx];
            if (tab.dirty && !confirm(`"${tab.name}" is unsaved. Close anyway?`)) return prev;
            try { tab.model?.dispose(); } catch { }
            const next = [...prev];
            next.splice(idx, 1);


            if (next.length > 0) {
                setActiveTabId(next[Math.min(idx, next.length - 1)].id);
            } else {
                setActiveTabId(null);
            }
            return next;
        });
    }, []);

    const updateTab = useCallback((id: number, changes: Partial<TabState>) => {
        setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    }, []);

    const saveViewState = useCallback((id: number) => {
        const editor = editorRef.current;
        if (!editor) return;
        const viewState = editor.saveViewState();
        if (viewState) {
            updateTab(id, { viewState });
        }
    }, [updateTab]);

    const handleSetActiveTabId = useCallback((id: number | null) => {
        if (activeTabId !== null && activeTabId !== id) {
            saveViewState(activeTabId);
        }
        setActiveTabId(id);
    }, [activeTabId, saveViewState]);



    const appendOutput = useCallback(
        (text: string, type: OutputLine['type'] = 'info', clickable = false, filePath: string | null = null) => {
            outputLineIdRef.current += 1;
            const line: OutputLine = { id: outputLineIdRef.current, text, type, clickable, filePath };
            setOutputLines((prev) => [...prev, line]);
            if (outputCollapsed) setOutputCollapsed(false);
        },
        [outputCollapsed]
    );

    const clearOutput = useCallback(() => setOutputLines([]), []);

    const value: EditorContextValue = {
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId: handleSetActiveTabId,
        createTab,
        closeTab,
        updateTab,
        saveViewState,
        editorRef,
        monacoRef,
        settings,
        setSettings,
        currentFolderPath,
        setCurrentFolderPath,
        currentEncoding,
        setCurrentEncoding,
        outputLines,
        appendOutput,
        clearOutput,
        outputCollapsed,
        setOutputCollapsed,
        detectedServerPath,
        setDetectedServerPath,
        detectedServerType,
        setDetectedServerType,
        detectedConfigPath,
        setDetectedConfigPath,
        serverRunning,
        setServerRunning,
        tabCounterRef,
        isProgrammaticUpdate,
    };

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditorContext(): EditorContextValue {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error('useEditorContext must be used within EditorProvider');
    return ctx;
}
