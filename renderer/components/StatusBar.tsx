'use client';

import { useEditorContext } from '../context/EditorContext';
import { useLanguage } from '../i18n/LanguageContext';

interface StatusBarProps {
    onEncodingClick: () => void;
}

export default function StatusBar({ onEncodingClick }: StatusBarProps) {
    const { tabs, activeTabId, currentEncoding, currentFolderPath } = useEditorContext();
    const { t } = useLanguage();
    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    const cursor = activeTab?.cursor;
    const filename = activeTab?.path ?? activeTab?.name ?? t.statusBar.noFileOpen;

    return (
        <div className="status-bar">
            <div className="status-left">
                {activeTab && (
                    <>
                        <span className="status-item" title={activeTab.path ?? ''}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            {filename}
                        </span>
                        {cursor && (
                            <span className="status-item">
                                {t.statusBar.line} {cursor.lineNumber}, {t.statusBar.col} {cursor.column}
                            </span>
                        )}
                    </>
                )}
                {currentFolderPath && !activeTab && (
                    <span className="status-item">{currentFolderPath}</span>
                )}
            </div>
            <div className="status-right">
                <span className="status-item" style={{ cursor: 'pointer' }} onClick={onEncodingClick}>
                    {currentEncoding.toUpperCase()}
                </span>
                <span className="status-item">PAWN</span>
            </div>
        </div>
    );
}
