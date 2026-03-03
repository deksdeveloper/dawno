'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import * as MonacoType from 'monaco-editor';
import { useEditorContext, TabState } from '../context/EditorContext';
import { registerPawnLanguage } from '../pawn-lib/pawnLanguage';

export default function EditorPanel() {
    const {
        tabs, setTabs, activeTabId, updateTab, settings, setSettings,
        editorRef, monacoRef, isProgrammaticUpdate, shouldPreventFocus, activeTabIdRef
    } = useEditorContext();
    const monaco = useMonaco();
    const activeTab = tabs.find(t => t.id === activeTabId);


    const editor = editorRef.current;

    useEffect(() => {
        if (monaco) {
            monacoRef.current = monaco;
            const langs = monaco.languages.getLanguages();
            if (!langs.find(l => l.id === 'pawn')) {
                registerPawnLanguage(monaco);
            }
        }
    }, [monaco, monacoRef]);

    const handleEditorDidMount = (editor: MonacoType.editor.IStandaloneCodeEditor, monaco: typeof MonacoType) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Apply initial settings immediately
        editor.updateOptions({
            fontSize: settings.fontSize,
            theme: settings.theme === 'dark' ? 'vs-dark' : 'vs'
        });

        editor.onDidChangeModelContent(() => {
            if (isProgrammaticUpdate.current) return;
            const currentTabId = activeTabIdRef.current;
            if (currentTabId) {
                setTabs((prev: TabState[]) => {
                    const idx = prev.findIndex(t => t.id === currentTabId);
                    if (idx !== -1 && !prev[idx].dirty) {
                        const next = [...prev];
                        next[idx] = { ...next[idx], dirty: true };
                        return next;
                    }
                    return prev;
                });
            }
            // Auto-save debounce
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = window.setTimeout(() => {
                if (autoSaveEnabledRef.current) {
                    document.dispatchEvent(new CustomEvent('dawno:save-request', { detail: { isSaveAs: false } }));
                }
            }, autoSaveDelayRef.current);
        });

        let timeout: any;
        editor.onDidChangeCursorPosition(e => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (activeTabId) {
                    updateTab(activeTabId, { cursor: { lineNumber: e.position.lineNumber, column: e.position.column } });
                }
            }, 200);
        });
    };

    // Refs so the Monaco onDidChangeModelContent closure always reads latest values without stale closures
    const autoSaveEnabledRef = useRef(settings.autoSave ?? false);
    const autoSaveDelayRef = useRef(settings.autoSaveDelay ?? 1000);
    const autoSaveTimerRef = useRef<number | null>(null);

    useEffect(() => { autoSaveEnabledRef.current = settings.autoSave ?? false; }, [settings.autoSave]);
    useEffect(() => { autoSaveDelayRef.current = settings.autoSaveDelay ?? 1000; }, [settings.autoSaveDelay]);

    // React to settings changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions({
                fontSize: settings.fontSize,
                theme: settings.theme === 'dark' ? 'vs-dark' : 'vs',
                minimap: { enabled: settings.minimap ?? true },
                wordWrap: (settings.wordWrap ?? true) ? 'on' : 'off',
            });
            editorRef.current.layout();
        }
    }, [settings.fontSize, settings.theme, settings.minimap, settings.wordWrap]);

    // Handle Ctrl + / Ctrl - shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                if (e.key === '=' || e.key === '+') {
                    e.preventDefault();
                    setSettings(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 1, 30) }));
                } else if (e.key === '-') {
                    e.preventDefault();
                    setSettings(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 1, 8) }));
                } else if (e.key === '0') {
                    e.preventDefault();
                    setSettings(prev => ({ ...prev, fontSize: 14 }));
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setSettings]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        // CRITICAL: If there's no valid active tab, detach the model from the editor
        // BEFORE the lazy disposal runs. If we leave the editor holding a reference
        // to a model that then gets disposed, Monaco throws an unhandled internal
        // exception which React catches as a client-side crash.
        if (!activeTab || !activeTab.model || activeTab.model.isDisposed()) {
            editor.setModel(null);
            return;
        }

        if (editor.getModel() !== activeTab.model) {
            editor.setModel(activeTab.model);
            if (activeTab.viewState) {
                editor.restoreViewState(activeTab.viewState);
            }
            // Force layout calculation on model switch
            editor.layout();
        }

        if (shouldPreventFocus.current) {
            shouldPreventFocus.current = false;
        } else {
            editor.focus();
        }
    }, [activeTabId, activeTab?.id, activeTab?.model, activeTab?.viewState]);

    // Memoize options to prevent unnecessary re-renders of the Editor component
    const editorOptions = React.useMemo(() => ({
        fontSize: settings.fontSize,
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
        minimap: { enabled: settings.minimap ?? true },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection' as const,
        tabSize: 4,
        fixedOverflowWidgets: true,
        readOnly: false,
        cursorStyle: 'line' as const,
        wordWrap: (settings.wordWrap ?? true) ? 'on' as const : 'off' as const,
    }), [settings.fontSize, settings.minimap, settings.wordWrap]);

    // CRITICAL FIX: We must NEVER unmount the Monaco <Editor> component.
    // If we unmount it, editorRef and monacoRef become null, causing a crash
    // when the user tries to open a new file after closing all tabs.
    // Instead, we always keep it mounted and just hide it visually when there
    // is no active tab. Model switching is handled imperatively via setModel()
    // in the useEffect above, NOT via the `defaultValue` prop.
    const isVisible = !!(activeTab && activeTab.model && !activeTab.model.isDisposed());

    return (
        <div className="editor-container" style={{ height: '100%', width: '100%', position: 'relative' }}>
            <Editor
                theme={settings.theme === 'dark' ? 'vs-dark' : 'vs'}
                language="pawn"
                defaultValue=""
                onMount={handleEditorDidMount}
                options={editorOptions}
            />
            {!isVisible && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'var(--bg-primary, #1e1e1e)',
                    zIndex: 10,
                    pointerEvents: 'none'
                }} />
            )}
        </div>
    );
}
