'use client';

import { useState } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';
import { useLanguage } from '../i18n/LanguageContext';

interface TitleBarProps {
    onOpenSettings: () => void;
    onOpenServer: () => void;
    onOpenConfig: () => void;
}

export default function TitleBar({ onOpenSettings, onOpenServer, onOpenConfig }: TitleBarProps) {
    const { tabs, activeTabId, closeTab } = useEditorContext();
    const { newFile, openFile, openFolder, closeFolder, saveFile } = useFileOperations();
    const { t } = useLanguage();
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
        if (dirty.length > 0 && !confirm(t.window.unsavedChangesConfirm(dirty.length))) return;
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
                { }
                <div className={`menu-item ${activeMenu === 'file' ? 'active' : ''}`} onClick={() => toggleMenu('file')}>
                    <span>{t.menu.file}</span>
                    <div className="dropdown">
                        <div className="dropdown-item" onClick={() => handleMenuAction('new')}><span>{t.file.newFile}</span><span className="kbd">Ctrl+N</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('open')}><span>{t.file.openFile}</span><span className="kbd">Ctrl+O</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('open-folder')}><span>{t.file.openFolder}</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('close-folder')}><span>{t.file.closeFolder}</span></div>
                        <div className="dropdown-separator" />
                        <div className="dropdown-item" onClick={() => handleMenuAction('save')}><span>{t.file.save}</span><span className="kbd">Ctrl+S</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('saveas')}><span>{t.file.saveAs}</span><span className="kbd">Ctrl+Shift+S</span></div>
                        <div className="dropdown-separator" />
                        <div className="dropdown-item" onClick={() => handleMenuAction('close-tab')}><span>{t.file.closeTab}</span><span className="kbd">Ctrl+W</span></div>
                    </div>
                </div>

                { }
                <div className={`menu-item ${activeMenu === 'build' ? 'active' : ''}`} onClick={() => toggleMenu('build')}>
                    <span>{t.menu.build}</span>
                    <div className="dropdown">
                        <div className="dropdown-item" onClick={() => handleMenuAction('compile')}><span>{t.build.compile}</span><span className="kbd">F5</span></div>
                        <div className="dropdown-separator" />
                        <div className="dropdown-item" onClick={() => handleMenuAction('server-manager')}><span>{t.build.serverManager}</span></div>
                        <div className="dropdown-item" onClick={() => handleMenuAction('config-editor')}><span>{t.build.configEditor}</span></div>
                    </div>
                </div>

                { }
                <div className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`} onClick={() => toggleMenu('settings')}>
                    <span>{t.menu.settings}</span>
                    <div className="dropdown">
                        <div className="dropdown-item" onClick={() => handleMenuAction('open-settings')}><span>{t.preferences}</span></div>
                    </div>
                </div>
            </div>

            <div className="titlebar-right">
                <button className="win-btn" title={t.window.minimize} onClick={() => window.api?.minimize()}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="5.5" width="8" height="1" fill="currentColor" /></svg>
                </button>
                <button className="win-btn" title={t.window.maximize} onClick={() => window.api?.maximize()}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
                </button>
                <button className="win-btn close" title={t.window.close} onClick={handleWindowClose}>
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <line x1="2.5" y1="2.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="9.5" y1="2.5" x2="2.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
