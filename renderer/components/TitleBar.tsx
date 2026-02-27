'use client';

import { useState } from 'react';
import { useEditorContext } from '@/context/EditorContext';
import { useFileOperations } from '@/hooks/useFileOperations';

interface TitleBarProps {
    onOpenSettings: () => void;
    onOpenServer: () => void;
    onOpenConfig: () => void;
}

export default function TitleBar({ onOpenSettings, onOpenServer, onOpenConfig }: TitleBarProps) {
    const { tabs, activeTabId, closeTab } = useEditorContext();
    const { newFile, openFile, openFolder, closeFolder, saveFile } = useFileOperations();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const toggleMenu = (menu: string) => setActiveMenu((prev) => (prev === menu ? null : menu));

    const handleMenuAction = (action: string) => {
        setActiveMenu(null);
        switch (action) {
            case 'new': newFile(); break;
            case 'open': openFile(); break;
            case 'open-folder': openFolder(); break;
            case 'close-folder': closeFolder(); break;
            case 'save': saveFile(); break;
            case 'saveas': saveFile(true); break;
            case 'close-tab': if (activeTabId) closeTab(activeTabId); break;
            case 'compile': document.dispatchEvent(new CustomEvent('dawno:compile')); break;
            case 'open-settings': onOpenSettings(); break;
            case 'server-manager': onOpenServer(); break;
            case 'config-editor': onOpenConfig(); break;
        }
    };

    const handleWindowClose = () => {
        const dirty = tabs.filter(t => t.dirty);
        if (dirty.length > 0 && !confirm(`${dirty.length} file(s) have unsaved changes. Close anyway?`)) return;
        window.api?.close();
    };

    return (
        <div className="titlebar" onClick={() => setActiveMenu(null)}>
            <div className="titlebar-left">
                <div className="app-logo">
                    <img src="./assets/icon-32.png" alt="DAWNO Logo" />
                </div>
                <span className="app-name">DAWNO</span>
                <span className="app-subtitle">SA-MP PAWN Editor</span>
            </div>

            <div className="titlebar-menu" onClick={(e) => e.stopPropagation()}>
                {}
                <div className={`menu-item ${activeMenu === 'file' ? 'active' : ''}`} onClick={() => toggleMenu('file')}>
                    <span>File</span>
                    <div className="dropdown">
                        <div className="dropdown-item" onClick={() => handleMenuAction('new')}><span>New File</span><span className="kbd">Ctrl+N</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('open')}><span>Open File...</span><span className="kbd">Ctrl+O</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('open-folder')}><span>Open Folder...</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('close-folder')}><span>Close Folder</span></div>
                        <div className="dropdown-separator" />
                        <div className="dropdown-item" onClick={() => handleMenuAction('save')}><span>Save</span><span className="kbd">Ctrl+S</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('saveas')}><span>Save As...</span><span className="kbd">Ctrl+Shift+S</span></div>
                        <div className="dropdown-separator" />
                        <div className="dropdown-item" onClick={() => handleMenuAction('close-tab')}><span>Close Tab</span><span className="kbd">Ctrl+W</span></div>
                    </div>
                </div>

                {}
                <div className={`menu-item ${activeMenu === 'build' ? 'active' : ''}`} onClick={() => toggleMenu('build')}>
                    <span>Build</span>
                    <div className="dropdown">
                        <div className="dropdown-item" onClick={() => handleMenuAction('compile')}><span>Compile</span><span className="kbd">F5</span></div>
                        <div className="dropdown-separator" />
                        <div className="dropdown-item" onClick={() => handleMenuAction('server-manager')}><span>Server Manager</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('config-editor')}><span>Config Editor</span></div>
                    </div>
                </div>

                {}
                <div className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`} onClick={() => toggleMenu('settings')}>
                    <span>Settings</span>
                    <div className="dropdown">
                        <div className="dropdown-item" onClick={() => handleMenuAction('open-settings')}><span>Preferences</span></div>
                    </div>
                </div>
            </div>

            <div className="titlebar-right">
                <button className="win-btn" title="Minimize" onClick={() => window.api?.minimize()}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="5.5" width="8" height="1" fill="currentColor" /></svg>
                </button>
                <button className="win-btn" title="Maximize" onClick={() => window.api?.maximize()}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
                </button>
                <button className="win-btn close" title="Close" onClick={handleWindowClose}>
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
