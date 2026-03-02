'use client';

import { useEffect, useRef } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useLanguage } from '../i18n/LanguageContext';

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 600;
const DEFAULT_HEIGHT = 180;

export default function OutputPanel() {
    const { outputLines, clearOutput, outputCollapsed, setOutputCollapsed, editorRef } = useEditorContext();
    const { t } = useLanguage();
    const bodyRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);
    // Overlay div to block Monaco's pointer events & resize observers during drag
    const overlay = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (bodyRef.current && !outputCollapsed) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [outputLines, outputCollapsed]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!isResizing.current || !panelRef.current) return;

            // Native absolute coordinate tracking — precisely matches how the Sidebar resizes.
            // 24px is the height of the StatusBar at the bottom.
            const newHeight = window.innerHeight - e.clientY - 24;
            const clampedHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight));

            // Synchronous direct DOM mutation bypasses React's render batching queue
            panelRef.current.style.height = `${clampedHeight}px`;

            // CRITICAL FIX: The "smooth / laggy" feel comes from Monaco Editor's automaticLayout
            // which uses ResizeObserver (asynchronous 1-frame lag). By forcing layout() immediately 
            // after our manual DOM mutation, Monaco is forced to do a synchronous forced layout
            // in the exact same paint cycle, making the resize feel 100% instant and rigid like VS Code.
            if (editorRef.current) {
                editorRef.current.layout();
            }
        };
        const onUp = () => {
            if (!isResizing.current) return;
            isResizing.current = false;
            // Remove overlay
            if (overlay.current) {
                overlay.current.remove();
                overlay.current = null;
            }
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, []);

    const onResizerDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;

        // Block Monaco from receiving ANY mouse/resize events during drag
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;z-index:9999;cursor:ns-resize;';
        document.body.appendChild(ov);
        overlay.current = ov;

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ns-resize';
    };

    return (
        <div
            ref={panelRef}
            className={`output-panel ${outputCollapsed ? 'collapsed' : ''}`}
            style={outputCollapsed ? undefined : { height: DEFAULT_HEIGHT }}
        >
            {!outputCollapsed && (
                <div
                    className="output-resizer"
                    onMouseDown={onResizerDown}
                    onDoubleClick={() => { if (panelRef.current) panelRef.current.style.height = `${DEFAULT_HEIGHT}px`; }}
                    title="Drag to resize"
                />
            )}

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
                    <button
                        className="output-action-btn"
                        title={outputCollapsed ? t.output.expand : t.output.collapse}
                        onClick={() => setOutputCollapsed(!outputCollapsed)}
                    >
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
