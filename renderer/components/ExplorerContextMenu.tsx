'use client';

import { useState } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';
import InlineInput from './InlineInput';

interface ExplorerContextMenuProps {
    x: number;
    y: number;
    itemPath: string;
    isDirectory: boolean;
    onClose: () => void;
}

type PendingAction = 'rename' | 'new-file' | 'new-folder' | 'delete-confirm' | null;

export default function ExplorerContextMenu({ x, y, itemPath, isDirectory, onClose }: ExplorerContextMenuProps) {
    const { currentFolderPath, appendOutput } = useEditorContext();
    const { openFileByPath } = useFileOperations();
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
                appendOutput(`Copied path: ${itemPath}`, 'info');
                break;
            case 'copy-relative':
                onClose();
                if (currentFolderPath) {
                    const rel = itemPath.replace(currentFolderPath, '').replace(/^[\\/]/, '');
                    navigator.clipboard.writeText(rel);
                    appendOutput(`Copied relative path: ${rel}`, 'info');
                }
                break;
            case 'delete':
                setPendingAction('delete-confirm');
                break;
        }
    };

    const handleRenameConfirm = async (newName: string) => {
        const oldName = itemPath.split(/[\\/]/).pop();
        if (newName !== oldName) {
            const parent = itemPath.split(/[\\/]/).slice(0, -1).join('\\');
            const newPath = `${parent}\\${newName}`;
            const res = await window.api.moveFile({ src: itemPath, dest: newPath });
            if (!res.success) appendOutput(`Error renaming: ${res.error}`, 'error');
        }
        onClose();
    };

    const handleNewFileConfirm = async (name: string) => {
        const basePath = isDirectory ? itemPath : itemPath.split(/[\\/]/).slice(0, -1).join('\\');
        const newPath = `${basePath}\\${name}`;
        const res = await window.api.createFile(newPath);
        if (!res.success) appendOutput(`Error creating file: ${res.error}`, 'error');
        onClose();
    };

    const handleNewFolderConfirm = async (name: string) => {
        const basePath = isDirectory ? itemPath : itemPath.split(/[\\/]/).slice(0, -1).join('\\');
        const newPath = `${basePath}\\${name}`;
        const res = await window.api.createFolder(newPath);
        if (!res.success) appendOutput(`Error creating folder: ${res.error}`, 'error');
        onClose();
    };

    const handleDeleteConfirm = async () => {
        const res = await window.api.deleteFile(itemPath);
        if (!res.success) appendOutput(`Error deleting: ${res.error}`, 'error');
        onClose();
    };

    // Show inline input overlays
    if (pendingAction === 'rename') {
        const oldName = itemPath.split(/[\\/]/).pop() || '';
        return (
            <InlineInput
                defaultValue={oldName}
                placeholder="New name..."
                onConfirm={handleRenameConfirm}
                onCancel={onClose}
            />
        );
    }

    if (pendingAction === 'new-file') {
        return (
            <InlineInput
                defaultValue=""
                placeholder="File name (e.g. script.pwn)"
                onConfirm={handleNewFileConfirm}
                onCancel={onClose}
            />
        );
    }

    if (pendingAction === 'new-folder') {
        return (
            <InlineInput
                defaultValue=""
                placeholder="Folder name..."
                onConfirm={handleNewFolderConfirm}
                onCancel={onClose}
            />
        );
    }

    if (pendingAction === 'delete-confirm') {
        const name = itemPath.split(/[\\/]/).pop() || itemPath;
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
                        Delete <strong>{name}</strong>? This will move it to Trash.
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
                        >Cancel</button>
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
                        >Delete</button>
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
                    <span>Open</span>
                </div>
            )}
            <div className="menu-item" onClick={() => handleAction('rename')}>
                <span>Rename</span>
                <span className="kbd">F2</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('new-file')}>
                <span>New File</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('new-folder')}>
                <span>New Folder</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('copy-path')}>
                <span>Copy Path</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('copy-relative')}>
                <span>Copy Relative Path</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('delete')}>
                <span>Delete</span>
                <span className="kbd">Del</span>
            </div>
        </div>
    );
}
