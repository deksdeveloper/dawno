'use client';

import { useEffect } from 'react';
import { useEditorContext } from '../context/EditorContext';

export function useEditorBridge() {
    const { tabs, activeTabId, updateTab, settings, currentEncoding, appendOutput, clearOutput, editorRef } = useEditorContext();

    useEffect(() => {
        
        const handleSaveRequest = async (e: any) => {
            const activeTab = tabs.find(t => t.id === activeTabId);
            if (!activeTab || !activeTab.model) return;

            const { isSaveAs } = e.detail;
            const content = activeTab.model.getValue();

            const savedPath = await window.api.saveFile({
                filePath: isSaveAs ? null : activeTab.path,
                content,
                encoding: currentEncoding
            });

            if (savedPath) {
                const name = savedPath.split(/[\\/]/).pop() || 'untitled';
                updateTab(activeTab.id, { path: savedPath, name, dirty: false });
                appendOutput(`File saved: ${savedPath}`, 'success');
            }
        };

        
        const handleCompile = async () => {
            const activeTab = tabs.find(t => t.id === activeTabId);
            if (!activeTab || !activeTab.path) {
                appendOutput('Please save the file before compiling.', 'warning');
                return;
            }

            if (activeTab.dirty) {
                
                const content = activeTab.model!.getValue();
                await window.api.saveFile({ filePath: activeTab.path, content, encoding: currentEncoding });
                updateTab(activeTab.id, { dirty: false });
            }

            if (!settings.compilerPath) {
                appendOutput('Compiler path not set. Please go to settings.', 'error');
                return;
            }

            clearOutput();
            appendOutput(`Compiling ${activeTab.name}...`, 'info');

            const res = await window.api.compileFile({
                filePath: activeTab.path,
                compilerPath: settings.compilerPath,
                includePaths: settings.includePaths
            });

            if (res.success) {
                appendOutput(res.output, 'success');
                appendOutput('Compilation finished successfully.', 'success');
            } else {
                
                const lines = res.output.split('\n');
                lines.forEach(line => {
                    const match = line.match(/\(([^)]+)\)\s*:\s*(error|warning)/);
                    if (match) {
                        appendOutput(line, match[2] as any, true, activeTab.path);
                    } else {
                        appendOutput(line, 'error');
                    }
                });
            }
        };

        document.addEventListener('dawno:save-request', handleSaveRequest);
        document.addEventListener('dawno:compile', handleCompile);

        return () => {
            document.removeEventListener('dawno:save-request', handleSaveRequest);
            document.removeEventListener('dawno:compile', handleCompile);
        };
    }, [tabs, activeTabId, updateTab, settings, currentEncoding, appendOutput, clearOutput]);
}
