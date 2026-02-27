'use client';

import React, { useEffect, useRef } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import * as MonacoType from 'monaco-editor';
import { useEditorContext, TabState } from '../context/EditorContext';
import { registerPawnLanguage } from '../pawn-lib/pawnLanguage';

export default function EditorPanel() {
    const { tabs, setTabs, activeTabId, updateTab, settings, editorRef, monacoRef, isProgrammaticUpdate } = useEditorContext();
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

    // React to settings changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions({
                fontSize: settings.fontSize,
                theme: settings.theme === 'dark' ? 'vs-dark' : 'vs'
            });
            // Some versions of Monaco need a layout trigger for font size changes to reflect immediately
            editorRef.current.layout();
        }
    }, [settings.fontSize, settings.theme]);

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
    }, [activeTabId, activeTab?.id, activeTab?.model, activeTab?.viewState]);

    return (
        <div className="editor-container" style={{ height: '100%', width: '100%', position: 'relative' }}>
            <Editor
                theme={settings.theme === 'dark' ? 'vs-dark' : 'vs'}
                language="pawn"
                path={activeTab?.path || `untitled-${activeTab?.id}`}
                defaultValue={activeTab?.model?.getValue() || ''}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: settings.fontSize,
                    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                    minimap: { enabled: true },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'selection',
                    tabSize: 4,
                    fixedOverflowWidgets: true,
                    readOnly: false,
                    cursorStyle: 'line',
                }}
            />
        </div>
    );
}
