'use client';

import { useEffect } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';

export function useKeyboardShortcuts({ setSettingsOpen }: { setSettingsOpen: (v: boolean) => void }) {
    const { activeTabId, closeTab, editorRef } = useEditorContext();
    const { newFile, openFile, saveFile } = useFileOperations();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'n': e.preventDefault(); newFile(); break;
                    case 'o': e.preventDefault(); openFile(); break;
                    case 's':
                        e.preventDefault();
                        saveFile(e.shiftKey);
                        break;
                    case 'w':
                        e.preventDefault();
                        if (activeTabId) closeTab(activeTabId);
                        break;
                    case 'f':
                        editorRef.current?.trigger('keyboard', 'actions.find', {});
                        break;
                    case 'h':
                        e.preventDefault();
                        editorRef.current?.trigger('keyboard', 'editor.action.startFindReplaceAction', {});
                        break;
                    case 'g':
                        e.preventDefault();
                        editorRef.current?.trigger('keyboard', 'editor.action.gotoLine', {});
                        break;
                    case ',':
                        e.preventDefault();
                        setSettingsOpen(true);
                        break;
                }
            }

            if (e.key === 'F5') {
                e.preventDefault();
                document.dispatchEvent(new CustomEvent('dawno:compile'));
            }

            if (e.key === 'F2') {
                // reserved
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [newFile, openFile, saveFile, activeTabId, closeTab, editorRef, setSettingsOpen]);
}
