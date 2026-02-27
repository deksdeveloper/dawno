'use client';

import React, { useEffect, useRef } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import * as MonacoType from 'monaco-editor';
import { useEditorContext, TabState } from '../context/EditorContext';
import { registerPawnLanguage } from '../lib/pawnLanguage';

export default function EditorPanel() {
    const { tabs, setTabs, activeTabId, updateTab, settings, editorRef, monacoRef } = useEditorContext();
    const monaco = useMonaco();
    const activeTab = tabs.find(t => t.id === activeTabId);

    
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

        
        editor.onDidChangeModelContent(() => {
            if (activeTabId) {
                setTabs((prev: TabState[]) => {
                    const idx = prev.findIndex(t => t.id === activeTabId);
                    if (idx !== -1 && !prev[idx].dirty) {
                        const next = [...prev];
                        next[idx] = { ...next[idx], dirty: true };
                        return next;
                    }
                    return prev;
                });
            }
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

    useEffect(() => {
        const editor = editorRef.current;
        if (editor && activeTab?.model) {
            if (editor.getModel() !== activeTab.model) {
                editor.setModel(activeTab.model);
                if (activeTab.viewState) {
                    editor.restoreViewState(activeTab.viewState);
                }
            }
            editor.focus();
        }
    }, [activeTabId, activeTab?.id, activeTab?.model, activeTab?.viewState, editorRef]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions({ fontSize: settings.fontSize });
        }
    }, [settings.fontSize, editorRef]);

    return (
        <div className="editor-container" style={{ height: '100%', width: '100%', position: 'relative' }}>
            <Editor
                theme="vs-dark"
                path={activeTab?.path || `untitled-${activeTab?.id}`}
                defaultValue={activeTab?.model?.getValue() || ''}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: settings.fontSize,
                    fontFamily: 'var(--font-mono)',
                    minimap: { enabled: true },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'selection',
                    tabSize: 4,
                    fixedOverflowWidgets: true,
                }}
            />
        </div>
    );
}
