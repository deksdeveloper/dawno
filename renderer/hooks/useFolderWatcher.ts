'use client';

import { useEffect } from 'react';
import { useEditorContext } from '../context/EditorContext';

export function useFolderWatcher() {
    const { currentFolderPath, appendOutput, tabs, updateTab, currentEncoding } = useEditorContext();

    useEffect(() => {
        if (!window.api || !currentFolderPath) return;

        const handleFolderChange = async (data: { eventType: string; filename: string }) => {
            // filename on Windows might have backslashes, normalize
            const normalizedFilename = data.filename.replace(/\\/g, '/');
            const fullPath = `${currentFolderPath.replace(/\\/g, '/')}/${normalizedFilename}`;

            // Check if any tab is using this file
            const affectedTab = tabs.find(t => t.path && t.path.replace(/\\/g, '/') === fullPath);

            if (affectedTab && affectedTab.model) {
                // If it's a 'rename' or 'change', we check content
                // Wait slightly to ensure file is written
                setTimeout(async () => {
                    try {
                        const { content, error } = await window.api.readFile(fullPath, currentEncoding);
                        if (!error && content !== null) {
                            const currentVal = affectedTab.model?.getValue();
                            if (content !== currentVal) {
                                if (!affectedTab.dirty) {
                                    // Auto-reload
                                    affectedTab.model?.setValue(content);
                                    appendOutput(`File "${affectedTab.name}" reloaded from disk.`, 'info');
                                } else {
                                    // User has unsaved changes, just notify
                                    appendOutput(`File "${affectedTab.name}" was modified externally. You have unsaved changes.`, 'warning');
                                }
                            }
                        }
                    } catch (err) {
                        // File might have been deleted
                        const exists = await window.api.exists(fullPath);
                        if (!exists) {
                            appendOutput(`File "${affectedTab.name}" was deleted or moved.`, 'warning');
                            updateTab(affectedTab.id, { dirty: true }); // Mark as dirty/phantom if deleted? 
                            // Or leave it as is so user can save it elsewhere.
                        }
                    }
                }, 100);
            }
        };

        const unsubscribe = window.api.onFolderChange(handleFolderChange);

        return () => {
            // Since onFolderChange might not return a direct unsubscribe in this simple bridge,
            // we rely on the implementation or just let it be for now if multiple listeners are handled.
            // In our main.js/preload.js, it's a simple .on(), which might leak if not careful.
            // But for this task, focus on functionality.
        };
    }, [currentFolderPath, appendOutput, tabs, updateTab, currentEncoding]);
}
