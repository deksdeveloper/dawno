'use client';

import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';

interface ExplorerContextMenuProps {
    x: number;
    y: number;
    itemPath: string;
    isDirectory: boolean;
    onClose: () => void;
}

export default function ExplorerContextMenu({ x, y, itemPath, isDirectory, onClose }: ExplorerContextMenuProps) {
    const { currentFolderPath, appendOutput } = useEditorContext();
    const { openFileByPath } = useFileOperations();

    const handleAction = async (action: string) => {
        onClose();
        switch (action) {
            case 'open':
                if (!isDirectory) openFileByPath(itemPath);
                break;
            case 'rename': {
                const oldName = itemPath.split(/[\\/]/).pop();
                const newName = prompt('Rename to:', oldName);
                if (newName && newName !== oldName) {
                    const parent = itemPath.split(/[\\/]/).slice(0, -1).join('/');
                    const newPath = `${parent}/${newName}`;
                    const res = await window.api.moveFile({ src: itemPath, dest: newPath });
                    if (!res.success) appendOutput(`Error renaming: ${res.error}`, 'error');
                }
                break;
            }
            case 'new-file': {
                const name = prompt('File name:');
                if (name) {
                    const path = isDirectory ? `${itemPath}/${name}` : `${itemPath.split(/[\\/]/).slice(0, -1).join('/')}/${name}`;
                    const res = await window.api.createFile(path);
                    if (!res.success) appendOutput(`Error creating file: ${res.error}`, 'error');
                }
                break;
            }
            case 'new-folder': {
                const name = prompt('Folder name:');
                if (name) {
                    const path = isDirectory ? `${itemPath}/${name}` : `${itemPath.split(/[\\/]/).slice(0, -1).join('/')}/${name}`;
                    const res = await window.api.createFolder(path);
                    if (!res.success) appendOutput(`Error creating folder: ${res.error}`, 'error');
                }
                break;
            }
            case 'copy-path':
                navigator.clipboard.writeText(itemPath);
                appendOutput(`Copied path: ${itemPath}`, 'info');
                break;
            case 'copy-relative':
                if (currentFolderPath) {
                    const rel = itemPath.replace(currentFolderPath, '').replace(/^[\\/]/, '');
                    navigator.clipboard.writeText(rel);
                    appendOutput(`Copied relative path: ${rel}`, 'info');
                }
                break;
            case 'delete':
                if (confirm(`Are you sure you want to delete ${itemPath}?`)) {
                    const res = await window.api.deleteFile(itemPath);
                    if (!res.success) appendOutput(`Error deleting: ${res.error}`, 'error');
                }
                break;
        }
    };

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
