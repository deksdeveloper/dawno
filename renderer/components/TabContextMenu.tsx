'use client';

import { useEditorContext } from '../context/EditorContext';
import { useLanguage } from '../i18n/LanguageContext';

interface TabContextMenuProps {
    x: number;
    y: number;
    tabId: number;
    onClose: () => void;
}

export default function TabContextMenu({ x, y, tabId, onClose }: TabContextMenuProps) {
    const { tabs, closeTab, currentFolderPath, appendOutput } = useEditorContext();
    const { t } = useLanguage();

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
                    appendOutput(t.output_msgs.copiedPath(tab.path), 'info');
                }
                break;
            case 'copy-relative-tab':
                const rtab = tabs.find(t => t.id === tabId);
                if (rtab?.path && currentFolderPath) {
                    const rel = rtab.path.replace(currentFolderPath, '').replace(/^[\\/]/, '');
                    navigator.clipboard.writeText(rel);
                    appendOutput(t.output_msgs.copiedRelative(rel), 'info');
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
                <span>{t.tabs.close}</span>
                <span className="kbd">Ctrl+W</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-saved')}>
                <span>{t.tabs.closeSaved}</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-others')}>
                <span>{t.tabs.closeOthers}</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-to-right')}>
                <span>{t.tabs.closeToRight}</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('close-all')}>
                <span>{t.tabs.closeAll}</span>
            </div>
            <div className="dropdown-separator" />
            <div className="menu-item" onClick={() => handleAction('copy-path')}>
                <span>{t.tabs.copyPath}</span>
            </div>
            <div className="menu-item" onClick={() => handleAction('copy-relative-tab')}>
                <span>{t.tabs.copyRelativePath}</span>
            </div>
        </div>
    );
}
