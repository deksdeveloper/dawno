'use client';

import { useEffect, useRef } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useLanguage } from '../i18n/LanguageContext';

export default function OutputPanel() {
    const { outputLines, clearOutput, outputCollapsed, setOutputCollapsed } = useEditorContext();
    const { t } = useLanguage();
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current && !outputCollapsed) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [outputLines, outputCollapsed]);

    return (
        <div className={`output-panel ${outputCollapsed ? 'collapsed' : ''}`}>
            <div className="output-header" onClick={() => setOutputCollapsed(!outputCollapsed)}>
                <div className="output-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
                    </svg>
                    {t.output.title}
                </div>
                <div className="output-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="output-action-btn" title={t.output.clear} onClick={clearOutput}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                    </button>
                    <button className="output-action-btn" title={outputCollapsed ? t.output.expand : t.output.collapse} onClick={() => setOutputCollapsed(!outputCollapsed)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {outputCollapsed
                                ? <polyline points="18 15 12 9 6 15" />
                                : <polyline points="6 9 12 15 18 9" />}
                        </svg>
                    </button>
                </div>
            </div>

            {!outputCollapsed && (
                <div className="output-body" ref={bodyRef}>
                    {outputLines.length === 0
                        ? <span className="output-placeholder">{t.output.placeholder}</span>
                        : outputLines.map((line) => (
                            <div
                                key={line.id}
                                className={`output-line ${line.type} ${line.clickable ? 'clickable' : ''}`}
                                onClick={() => {
                                    if (line.clickable && line.filePath) {
                                        document.dispatchEvent(new CustomEvent('dawno:open-file', { detail: line.filePath }));
                                    }
                                }}
                            >
                                {line.text}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
}
