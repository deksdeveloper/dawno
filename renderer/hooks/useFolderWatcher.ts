'use client';

import { useEffect, useRef } from 'react';
import { useEditorContext, TabState } from '../context/EditorContext';

export function useFolderWatcher() {
    const { currentFolderPath, appendOutput, tabs, updateTab, currentEncoding, isProgrammaticUpdate } = useEditorContext();
    const tabsRef = useRef(tabs);

    useEffect(() => {
        tabsRef.current = tabs;
    }, [tabs]);

    useEffect(() => {
        if (!window.api || !currentFolderPath) return;

        const handleFolderChange = async (data: { eventType: string; filename: string }) => {
            const normalizedFilename = data.filename.replace(/\\/g, '/');
            const fullPath = `${currentFolderPath.replace(/\\/g, '/')}/${normalizedFilename}`;

            const affectedTab = tabsRef.current.find((t: TabState) => t.path && t.path.replace(/\\/g, '/') === fullPath);

            if (affectedTab && affectedTab.model) {
                // Wait slightly to ensure file is written fully by external editor
                setTimeout(async () => {
                    try {
                        const { content, error } = await window.api.readFile(fullPath, currentEncoding);
                        if (!error && content !== null) {
                            const currentVal = affectedTab.model?.getValue();
                            if (content !== currentVal) {
                                if (!affectedTab.dirty) {
                                    // Auto-reload without triggering 'dirty' or 'change' logic loop
                                    isProgrammaticUpdate.current = true;
                                    affectedTab.model?.setValue(content);
                                    isProgrammaticUpdate.current = false;
                                    appendOutput(`File "${affectedTab.name}" reloaded from disk.`, 'info');
                                } else {
                                    appendOutput(`File "${affectedTab.name}" was modified externally. You have unsaved changes.`, 'warning');
                                }
                            }
                        }
                    } catch (err) {
                        const exists = await window.api.exists(fullPath);
                        if (!exists) {
                            appendOutput(`File "${affectedTab.name}" was deleted or moved.`, 'warning');
                        }
                    }
                }, 200);
            }
        };

        const unsubscribe = window.api.onFolderChange(handleFolderChange);

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [currentFolderPath, appendOutput, updateTab, currentEncoding, isProgrammaticUpdate]);
}
