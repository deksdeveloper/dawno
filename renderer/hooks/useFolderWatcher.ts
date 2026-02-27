import { useEffect, useRef } from 'react';
import { useEditorContext, TabState } from '../context/EditorContext';

export function useFolderWatcher() {
    const { currentFolderPath, appendOutput, tabs, updateTab, currentEncoding, isProgrammaticUpdate, monacoRef } = useEditorContext();
    const tabsRef = useRef(tabs);

    useEffect(() => {
        tabsRef.current = tabs;
    }, [tabs]);

    useEffect(() => {
        if (!window.api || !currentFolderPath) return;

        const handleFolderChange = async (data: { eventType: string; filename: string }) => {
            if (!data.filename) return;
            const normalizedFilename = data.filename.replace(/\\/g, '/');
            const fullPath = `${currentFolderPath.replace(/\\/g, '/')}/${normalizedFilename}`.toLowerCase();

            const affectedTab = tabsRef.current.find((t: TabState) => {
                if (!t.path) return false;
                const tabPath = t.path.replace(/\\/g, '/').toLowerCase();
                return tabPath === fullPath;
            });

            if (affectedTab && affectedTab.model) {
                // Wait slightly to ensure file is written fully by external editor
                setTimeout(async () => {
                    try {
                        const { content, error } = await window.api.readFile(affectedTab.path!, currentEncoding);
                        if (!error && content !== null) {
                            const currentVal = affectedTab.model?.getValue();
                            if (content !== currentVal) {
                                if (!affectedTab.dirty) {
                                    isProgrammaticUpdate.current = true;

                                    // Use pushEditOperations instead of setValue for better stability
                                    const model = affectedTab.model;
                                    if (model) {
                                        model.pushEditOperations(
                                            [],
                                            [{
                                                range: model.getFullModelRange(),
                                                text: content
                                            }],
                                            () => null
                                        );
                                    }

                                    isProgrammaticUpdate.current = false;
                                    appendOutput(`File "${affectedTab.name}" reloaded from disk.`, 'info');
                                } else {
                                    appendOutput(`File "${affectedTab.name}" was modified externally. You have unsaved changes.`, 'warning');
                                }
                            }
                        }
                    } catch (err) {
                        const exists = await window.api.exists(affectedTab.path!);
                        if (!exists) {
                            appendOutput(`File "${affectedTab.name}" was deleted or moved.`, 'warning');
                        }
                    }
                }, 150);
            }
        };

        const unsubscribe = window.api.onFolderChange(handleFolderChange);

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [currentFolderPath, appendOutput, updateTab, currentEncoding, isProgrammaticUpdate, monacoRef]);
}
