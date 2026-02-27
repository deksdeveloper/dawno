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
