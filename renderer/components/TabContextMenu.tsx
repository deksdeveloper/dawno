'use client';

import { useEditorContext } from '@/context/EditorContext';

interface TabContextMenuProps {
    x: number;
    y: number;
    tabId: number;
    onClose: () => void;
}

export default function TabContextMenu({ x, y, tabId, onClose }: TabContextMenuProps) {
    const { tabs, closeTab, updateTab, currentFolderPath, appendOutput, setActiveTabId } = useEditorContext();

    const handleAction = (action: string) => {
        onClose();
        switch (action) {
            case 'close':
                closeTab(tabId);
                break;
            case 'close-saved':
                tabs.filter(t => !t.dirty).forEach(t => closeTab(t.id));
                break;
            case 'close-others':
                tabs.filter(t => t.id !== tabId).forEach(t => closeTab(t.id));
                break;
            case 'close-to-right':
                const idx = tabs.findIndex(t => t.id === tabId);
                if (idx !== -1) tabs.slice(idx + 1).forEach(t => closeTab(t.id));
                break;
            case 'close-all':
                [...tabs].forEach(t => closeTab(t.id));
                break;
            case 'copy-path':
                const tab = tabs.find(t => t.id === tabId);
                if (tab?.path) {
                    navigator.clipboard.writeText(tab.path);
                    appendOutput(`Copied path: ${tab.path}`, 'info');
                }
                break;
            case 'copy-relative-tab':
                const rtab = tabs.find(t => t.id === tabId);
                if (rtab?.path && currentFolderPath) {
                    const rel = rtab.path.replace(currentFolderPath, '').replace(/^[\\/]/, '');
                    navigator.clipboard.writeText(rel);
                    appendOutput(`Copied relative path: ${rel}`, 'info');
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
            <div className="menu-item" onClick={() => handleAction('close')}>
                <span>Close</span>
                <span className="kbd">Ctrl+W</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-saved')}>
                <span>Close Saved</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-others')}>
                <span>Close Others</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-to-right')}>
                <span>Close to the Right</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-all')}>
                <span>Close All</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('copy-path')}>
                <span>Copy Path</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('copy-relative-tab')}>
                <span>Copy Relative Path</span>
            </div>
        </div>
    );
}
