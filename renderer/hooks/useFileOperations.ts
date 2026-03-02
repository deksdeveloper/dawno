'use client';

import { useEditorContext } from '../context/EditorContext';
import { useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export function useFileOperations() {
    const { t } = useLanguage();
    const {
        createTab, setCurrentFolderPath, currentEncoding, tabs, setActiveTabId, appendOutput,
        setDetectedServerPath, setDetectedServerType, setDetectedConfigPath, setSettings
    } = useEditorContext();

    const openFileByPath = useCallback(async (path: string) => {
        if (!window.api) return;

        const { content, error } = await window.api.readFile(path, currentEncoding);
        if (error) {
            let msg = `Error reading file: ${error}`;
            if (error === 'FILE_TOO_LARGE') msg = t.output_msgs.fileTooLarge;
            else if (error === 'FILE_IS_BINARY') msg = t.output_msgs.fileIsBinary;

            appendOutput(msg, 'error');
            return;
        }

        const name = path.split(/[\\/]/).pop() || 'untitled';
        const tab = createTab(name, path, content || '');
        if (!tab) {
            appendOutput(`Failed to open file: editor not ready yet. Please try again.`, 'error');
        }
    }, [currentEncoding, appendOutput, createTab, t]);

    const newFile = useCallback(() => {
        createTab(`script_${tabs.length + 1}.pwn`, null, '');
    }, [tabs.length, createTab]);

    const openFile = useCallback(async () => {
        const results = await window.api.openFile(currentEncoding);
        if (results) {
            for (const res of results) {
                if (res.error) {
                    let msg = `Error opening ${res.path}: ${res.error}`;
                    if (res.error === 'FILE_TOO_LARGE') msg = `${t.output_msgs.fileTooLarge} (${res.path})`;
                    else if (res.error === 'FILE_IS_BINARY') msg = `${t.output_msgs.fileIsBinary} (${res.path})`;
                    appendOutput(msg, 'error');
                    continue;
                }
                await openFileByPath(res.path);
            }
        }
    }, [currentEncoding, openFileByPath, t, appendOutput]);

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
