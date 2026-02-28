'use client';

import { useState } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';
import InlineInput from './InlineInput';
import { useLanguage } from '../i18n/LanguageContext';

interface ExplorerContextMenuProps {
    x: number;
    y: number;
    itemPath: string;
    isDirectory: boolean;
    onClose: () => void;
}

type PendingAction = 'rename' | 'new-file' | 'new-folder' | 'delete-confirm' | null;

export default function ExplorerContextMenu({ x, y, itemPath, isDirectory, onClose }: ExplorerContextMenuProps) {
    const { currentFolderPath, appendOutput, renameTab } = useEditorContext();
    const { openFileByPath } = useFileOperations();
    const { t } = useLanguage();
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    const handleAction = async (action: string) => {
        switch (action) {
            case 'open':
                onClose();
                if (!isDirectory) openFileByPath(itemPath);
                break;
            case 'rename':
                setPendingAction('rename');
                break;
            case 'new-file':
                setPendingAction('new-file');
                break;
            case 'new-folder':
                setPendingAction('new-folder');
                break;
            case 'copy-path':
                onClose();
                navigator.clipboard.writeText(itemPath);
                appendOutput(t.output_msgs.copiedPath(itemPath), 'info');
                break;
            case 'copy-relative':
                onClose();
                if (currentFolderPath) {
                    const rel = itemPath.replace(currentFolderPath, '').replace(/^[\\/]/, '');
                    navigator.clipboard.writeText(rel);
                    appendOutput(t.output_msgs.copiedRelative(rel), 'info');
                }
                break;
            case 'delete':
                setPendingAction('delete-confirm');
                break;
        }
    };

    const handleRenameConfirm = async (newName: string) => {
        const oldName = itemPath.split(/[\\\/]/).pop();
        if (newName !== oldName) {
            const parent = itemPath.split(/[\\\/]/).slice(0, -1).join('\\');
            const newPath = `${parent}\\${newName}`;
            const res = await window.api.moveFile({ src: itemPath, dest: newPath });
            if (!res.success) {
                appendOutput(t.output_msgs.errorRenaming(res.error ?? ''), 'error');
            } else {
                renameTab(itemPath, newPath);
            }
        }
        onClose();
    };

    const handleNewFileConfirm = async (name: string) => {
        const basePath = isDirectory ? itemPath : itemPath.split(/[\\\/]/).slice(0, -1).join('\\');
        const newPath = `${basePath}\\${name}`;
        const res = await window.api.createFile(newPath);
        if (!res.success) appendOutput(t.output_msgs.errorCreatingFile(res.error ?? ''), 'error');
        onClose();
    };

    const handleNewFolderConfirm = async (name: string) => {
        const basePath = isDirectory ? itemPath : itemPath.split(/[\\\/]/).slice(0, -1).join('\\');
        const newPath = `${basePath}\\${name}`;
        const res = await window.api.createFolder(newPath);
        if (!res.success) appendOutput(t.output_msgs.errorCreatingFolder(res.error ?? ''), 'error');
        onClose();
    };

    const handleDeleteConfirm = async () => {
        const res = await window.api.deleteFile(itemPath);
        if (!res.success) appendOutput(t.output_msgs.errorDeleting(res.error ?? ''), 'error');
        onClose();
    };

    if (pendingAction === 'rename') {
        const oldName = itemPath.split(/[\\\/]/).pop() || '';
        return (
            <InlineInput
                defaultValue={oldName}
                placeholder={t.explorer.renamePlaceholder}
                onConfirm={handleRenameConfirm}
                onCancel={onClose}
            />
        );
    }

    if (pendingAction === 'new-file') {
        return (
            <InlineInput
                defaultValue=""
                placeholder={t.explorer.newFilePlaceholder}
                onConfirm={handleNewFileConfirm}
                onCancel={onClose}
            />
        );
    }

    if (pendingAction === 'new-folder') {
        return (
            <InlineInput
                defaultValue=""
                placeholder={t.explorer.newFolderPlaceholder}
                onConfirm={handleNewFolderConfirm}
                onCancel={onClose}
            />
        );
    }

    if (pendingAction === 'delete-confirm') {
        const name = itemPath.split(/[\\\/]/).pop() || itemPath;
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.4)',
                }}
            >
                <div style={{
                    background: 'var(--bg-secondary, #161b22)',
                    border: '1px solid var(--border-color, #30363d)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    minWidth: '280px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}>
                    <p style={{ color: 'var(--text-primary, #e6edf3)', fontSize: '13px', margin: '0 0 12px' }}>
                        {t.explorer.deleteConfirm(name)}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color, #30363d)',
                                borderRadius: '4px',
                                color: 'var(--text-secondary, #8b949e)',
                                padding: '4px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                            }}
                        >{t.explorer.cancel}</button>
                        <button
                            onClick={handleDeleteConfirm}
                            style={{
                                background: '#da3633',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                                padding: '4px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                            }}
                        >{t.explorer.delete}</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="explorer-context-menu"
            style={{ display: 'block', left: x, top: y, position: 'fixed' }}
            onClick={(e) => e.stopPropagation()}
        >
            {!isDirectory && (
                <div className="menu-item" onClick={() => handleAction('open')}>
                    <span>{t.explorer.open}</span>
                </div>
            )}
            <div className="menu-item" onClick={() => handleAction('rename')}>
                <span>{t.explorer.rename}</span>
                <span className="kbd">F2</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('new-file')}>
                <span>{t.explorer.newFile}</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('new-folder')}>
                <span>{t.explorer.newFolder}</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('copy-path')}>
                <span>{t.explorer.copyPath}</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('copy-relative')}>
                <span>{t.explorer.copyRelativePath}</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('delete')}>
                <span>{t.explorer.delete}</span>
                <span className="kbd">Del</span>
            </div>
        </div>
    );
}
