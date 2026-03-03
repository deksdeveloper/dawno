'use client';

import { useEditorContext } from '../context/EditorContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useEffect, useState } from 'react';

interface StatusBarProps {
    onEncodingClick: () => void;
}

export default function StatusBar({ onEncodingClick }: StatusBarProps) {
    const { tabs, activeTabId, currentEncoding, currentFolderPath, settings, setSettings } = useEditorContext();
    const { t } = useLanguage();
    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    const cursor = activeTab?.cursor;
    const filename = activeTab?.path ?? activeTab?.name ?? t.statusBar.noFileOpen;

    // Live line count from the Monaco model
    const [lineCount, setLineCount] = useState<number | null>(null);
    useEffect(() => {
        const model = activeTab?.model;
        if (!model || model.isDisposed()) { setLineCount(null); return; }
        setLineCount(model.getLineCount());
        const disposable = model.onDidChangeContent(() => {
            if (!model.isDisposed()) setLineCount(model.getLineCount());
        });
        return () => disposable.dispose();
    }, [activeTab?.model]);

    // Git branch
    const [branch, setBranch] = useState<string | null>(null);
    useEffect(() => {
        if (!currentFolderPath || !window.api) { setBranch(null); return; }
        window.api.gitGetBranch(currentFolderPath).then(res => {
            setBranch(res.branch ?? null);
        }).catch(() => setBranch(null));
    }, [currentFolderPath]);

    const toggleWordWrap = () => {
        const next = !(settings.wordWrap ?? true);
        setSettings(prev => ({ ...prev, wordWrap: next }));
    };

    return (
        <div className="status-bar">
            <div className="status-left">
                {branch && (
                    <span className="status-item status-branch" title={`Git branch: ${branch}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="18" r="3" />
                            <circle cx="6" cy="6" r="3" />
                            <circle cx="18" cy="6" r="3" />
                            <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
                            <line x1="12" y1="12" x2="12" y2="15" />
                        </svg>
                        {branch}
                    </span>
                )}
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
                        {lineCount !== null && (
                            <span className="status-item" title="Total lines">
                                {lineCount} {t.statusBar.lines ?? 'lines'}
                            </span>
                        )}
                    </>
                )}
                {currentFolderPath && !activeTab && !branch && (
                    <span className="status-item">{currentFolderPath}</span>
                )}
            </div>
            <div className="status-right">
                <span
                    className={`status-item status-item-btn${(settings.wordWrap ?? true) ? ' active' : ''}`}
                    title={(settings.wordWrap ?? true) ? 'Word Wrap: ON (click to toggle)' : 'Word Wrap: OFF (click to toggle)'}
                    onClick={toggleWordWrap}
                    style={{ cursor: 'pointer' }}
                >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="17 10 21 6 17 2" />
                        <path d="M3 6h18" />
                        <path d="M3 12h14a4 4 0 0 1 0 8H7" />
                        <polyline points="11 16 7 20 11 24" />
                    </svg>
                    {(settings.wordWrap ?? true) ? 'Wrap' : 'No Wrap'}
                </span>
                <span className="status-item" style={{ cursor: 'pointer' }} onClick={onEncodingClick}>
                    {currentEncoding.toUpperCase()}
                </span>
                <span className="status-item">PAWN</span>
            </div>
        </div>
    );
}
