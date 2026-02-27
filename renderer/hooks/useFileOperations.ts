'use client';

import { useEditorContext } from '@/context/EditorContext';
import { useCallback } from 'react';

export function useFileOperations() {
    const {
        createTab, setCurrentFolderPath, currentEncoding, tabs, setActiveTabId, appendOutput,
        setDetectedServerPath, setDetectedServerType, setDetectedConfigPath, setSettings
    } = useEditorContext();

    const openFileByPath = useCallback(async (path: string) => {
        
        const existing = tabs.find(t => t.path === path);
        if (existing) {
            setActiveTabId(existing.id);
            return;
        }

        const { content, error } = await window.api.readFile(path, currentEncoding);
        if (error) {
            appendOutput(`Error reading file: ${error}`, 'error');
            return;
        }

        const name = path.split(/[\\/]/).pop() || 'untitled';
        createTab(name, path, content || '');
    }, [tabs, setActiveTabId, currentEncoding, appendOutput, createTab]);

    const newFile = useCallback(() => {
        createTab(`script_${tabs.length + 1}.pwn`, null, '');
    }, [tabs.length, createTab]);

    const openFile = useCallback(async () => {
        const results = await window.api.openFile(currentEncoding);
        if (results) {
            for (const res of results) {
                await openFileByPath(res.path);
            }
        }
    }, [currentEncoding, openFileByPath]);

    const openFolder = useCallback(async () => {
        const folderPath = await window.api.openFolderDialog();
        if (folderPath) {
            setCurrentFolderPath(folderPath);
            appendOutput(`Opened folder: ${folderPath}`, 'info');

            
            window.api.detectServer(folderPath).then(res => {
                if (res) {
                    setDetectedServerPath(res.path);
                    setDetectedServerType(res.type);
                    appendOutput(`Detected server executable: ${res.path}`, 'success');
                }
            });

            window.api.detectConfig(folderPath).then(res => {
                if (res) {
                    setDetectedConfigPath(res);
                    appendOutput(`Detected config file: ${res}`, 'success');
                }
            });

            window.api.findPawncc(folderPath).then(res => {
                if (res) {
                    setSettings(prev => ({ ...prev, compilerPath: res }));
                    appendOutput(`Detected compiler: ${res}`, 'success');
                }
            });
        }
    }, [setCurrentFolderPath, appendOutput, setDetectedServerPath, setDetectedServerType, setDetectedConfigPath, setSettings]);

    const closeFolder = useCallback(() => {
        setCurrentFolderPath(null);
    }, [setCurrentFolderPath]);

    const saveFile = useCallback(async (isSaveAs = false) => {
        
        
        document.dispatchEvent(new CustomEvent('dawno:save-request', { detail: { isSaveAs } }));
    }, []);

    return { newFile, openFile, openFolder, closeFolder, saveFile, openFileByPath };
}
