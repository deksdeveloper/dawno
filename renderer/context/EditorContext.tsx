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
import { locales, type Language } from '../i18n/index';


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
    closeTabs: (ids: number[]) => void;
    closeAllTabs: () => void;
    updateTab: (id: number, changes: Partial<TabState>) => void;
    renameTab: (oldPath: string, newPath: string) => void;
    saveViewState: (id: number) => void;
    goBack: () => void;
    goForward: () => void;


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
    shouldPreventFocus: React.MutableRefObject<boolean>;
    activeTabIdRef: React.MutableRefObject<number | null>;
}



const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [tabs, setTabs] = useState<TabState[]>([]);
    const [activeTabId, _setActiveTabId] = useState<number | null>(null);
    const [historyStack, setHistoryStack] = useState<number[]>([]);
    const [forwardStack, setForwardStack] = useState<number[]>([]);
    const isNavigating = useRef(false);

    const setActiveTabId = useCallback((id: number | null) => {
        if (!isNavigating.current && id !== activeTabId && activeTabId !== null) {
            setHistoryStack(prev => [...prev, activeTabId]);
            setForwardStack([]); // Clear forward stack on manual change
        }
        _setActiveTabId(id);
    }, [activeTabId]);

    const goBack = useCallback(() => {
        if (historyStack.length === 0) return;
        isNavigating.current = true;

        let previousId = -1;
        let newHistory = [...historyStack];

        // Find the last valid tab ID in history
        while (newHistory.length > 0) {
            const id = newHistory.pop()!;
            if (tabs.some(t => t.id === id)) {
                previousId = id;
                break;
            }
        }

        if (previousId !== -1) {
            if (activeTabId !== null) {
                setForwardStack(prev => [...prev, activeTabId]);
            }
            setHistoryStack(newHistory);
            _setActiveTabId(previousId);
        } else {
            setHistoryStack([]);
        }

        setTimeout(() => { isNavigating.current = false; }, 0);
    }, [historyStack, activeTabId, tabs]);

    const goForward = useCallback(() => {
        if (forwardStack.length === 0) return;
        isNavigating.current = true;

        let nextId = -1;
        let newForward = [...forwardStack];

        // Find the next valid tab ID in forward stack
        while (newForward.length > 0) {
            const id = newForward.pop()!;
            if (tabs.some(t => t.id === id)) {
                nextId = id;
                break;
            }
        }

        if (nextId !== -1) {
            if (activeTabId !== null) {
                setHistoryStack(prev => [...prev, activeTabId]);
            }
            setForwardStack(newForward);
            _setActiveTabId(nextId);
        } else {
            setForwardStack([]);
        }

        setTimeout(() => { isNavigating.current = false; }, 0);
    }, [forwardStack, activeTabId, tabs]);
    const [settings, setSettings] = useState<AppSettings>({
        compilerPath: '',
        includePaths: [],
        fontSize: 14,
        theme: 'dark',
        defaultEncoding: 'utf-8',
        discordRPC: true,
        language: 'en',
        minimap: true,
        wordWrap: true,
        autoSave: false,
        autoSaveDelay: 1000,
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
    const shouldPreventFocus = useRef(false);
    const outputLineIdRef = useRef(0);
    const activeTabIdRef = useRef<number | null>(null);
    const prevTabsRef = useRef<TabState[]>([]);

    // Keep activeTabIdRef in sync for use in Monaco callbacks (avoid stale state)
    useEffect(() => {
        activeTabIdRef.current = activeTabId;
    }, [activeTabId]);

    // Lazy Model Disposal Effect:
    // Disposes models ONLY after they have been removed from the 'tabs' state.
    // This allows React components like EditorPanel to finish their final render
    // cycle before the model vanishes, preventing "Model is disposed" crashes.
    useEffect(() => {
        const currentModelIds = new Set(tabs.map(t => t.id));
        const modelsToDispose: TabState[] = [];

        for (const prevTab of prevTabsRef.current) {
            if (!currentModelIds.has(prevTab.id)) {
                modelsToDispose.push(prevTab);
            }
        }

        // Update ref for next comparison
        prevTabsRef.current = [...tabs];

        if (modelsToDispose.length === 0) return;

        // Perform disposal in a microtask to be extra safe
        const timer = setTimeout(() => {
            modelsToDispose.forEach(tab => {
                try {
                    if (tab.model && !tab.model.isDisposed()) {
                        tab.model.dispose();
                    }
                } catch (e) {
                    console.error('Failed to dispose model lazily:', e);
                }
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [tabs]);


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

            // Check if a tab with this path already exists to prevent duplicate tabs
            if (path) {
                const existingTab = tabs.find(t => t.path === path);
                if (existingTab) {
                    setActiveTabId(existingTab.id);
                    return existingTab;
                }
            }

            tabCounterRef.current += 1;
            const id = tabCounterRef.current;

            // Use Uri.file for actual filesystem paths to handle Windows backslashes correctly
            // Use a custom scheme for untitled tabs
            const modelUri = path
                ? monaco.Uri.file(path)
                : monaco.Uri.parse(`dawno-untitled://${id}`);

            // Robust model retrieval/creation
            let model = monaco.editor.getModel(modelUri);
            if (!model) {
                console.log(`[EditorContext] Creating new model for URI: ${modelUri.toString()}`);
                try {
                    model = monaco.editor.createModel(content, 'pawn', modelUri);
                } catch (err) {
                    console.error('[EditorContext] Failed to create model:', err);
                    // Fallback to a unique ID if creation failed (rare URI conflict)
                    const fallbackUri = monaco.Uri.parse(`dawno-fallback://${Date.now()}-${id}`);
                    console.log(`[EditorContext] Falling back to URI: ${fallbackUri.toString()}`);
                    model = monaco.editor.createModel(content, 'pawn', fallbackUri);
                }
            } else {
                console.log(`[EditorContext] Model already exists for URI: ${modelUri.toString()}`);
                // If model exists, update content only if necessary.
                // We update if the current model value is empty and new content is provided,
                // OR if the model is not dirty and content changed (forced update from disk).
                const currentVal = model.getValue();
                const existingTab = tabs.find(t => t.id === id); // This might be null if we're creating
                const isDirty = existingTab ? existingTab.dirty : false;

                if (content !== undefined && content !== null && currentVal !== content && (currentVal === '' || !isDirty)) {
                    console.log(`[EditorContext] Updating existing model content. (Dirty: ${isDirty})`);
                    try {
                        isProgrammaticUpdate.current = true;
                        model.setValue(content);
                    } finally {
                        isProgrammaticUpdate.current = false;
                    }
                }
            }

            const tab: TabState = { id, name, path, model, dirty: false, ...state };
            console.log(`[EditorContext] Tab created/retrieved: ${id} (${name}), path: ${path}`);

            setTabs((prev) => [...prev, tab]);
            setActiveTabId(id);
            return tab;
        },
        [monacoRef, tabs, setActiveTabId]
    );

    const closeTabs = useCallback((ids: number[]) => {
        // 1. Identify which tabs exist and need closing
        const tabsToClose = tabs.filter(t => ids.includes(t.id));
        if (tabsToClose.length === 0) return;

        const lang = (settings.language as Language) || 'en';
        const locale = locales[lang] ?? locales.en;

        const finalIdsToClose: number[] = [];
        for (const tab of tabsToClose) {
            if (tab.dirty) {
                if (confirm(locale.tabs.unsavedConfirm(tab.name))) {
                    finalIdsToClose.push(tab.id);
                }
            } else {
                finalIdsToClose.push(tab.id);
            }
        }

        if (finalIdsToClose.length === 0) return;

        // 2. Update active tab if it's being closed
        if (activeTabId && finalIdsToClose.includes(activeTabId)) {
            const remaining = tabs.filter(t => !finalIdsToClose.includes(t.id));
            if (remaining.length > 0) {
                const idx = tabs.findIndex(t => t.id === activeTabId);
                // Find next best tab
                let nextIdx = Math.min(idx, remaining.length - 1);
                if (nextIdx < 0) nextIdx = 0;
                setActiveTabId(remaining[nextIdx].id);
            } else {
                setActiveTabId(null);
            }
        }

        // 3. Update tabs state
        // Disposal is now handled lazily by the useEffect above
        setTabs(prev => prev.filter(t => !finalIdsToClose.includes(t.id)));
    }, [tabs, activeTabId, setActiveTabId, settings.language]);

    const closeTab = useCallback((id: number) => {
        closeTabs([id]);
    }, [closeTabs]);

    const closeAllTabs = useCallback(() => {
        closeTabs(tabs.map(t => t.id));
    }, [tabs, closeTabs]);

    const updateTab = useCallback((id: number, changes: Partial<TabState>) => {
        setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    }, []);

    const renameTab = useCallback((oldPath: string, newPath: string) => {
        setTabs(prev => prev.map(tab => {
            if (tab.path === oldPath) {
                const newName = newPath.split(/[\\/]/).pop() || tab.name;
                return { ...tab, path: newPath, name: newName };
            }
            return tab;
        }));
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
        closeTabs,
        closeAllTabs,
        updateTab,
        renameTab,
        saveViewState,
        goBack,
        goForward,
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
        shouldPreventFocus,
        activeTabIdRef
    };

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditorContext(): EditorContextValue {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error('useEditorContext must be used within EditorProvider');
    return ctx;
}
