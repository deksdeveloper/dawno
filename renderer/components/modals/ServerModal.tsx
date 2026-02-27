'use client';

import { useEditorContext } from '../../context/EditorContext';
import { useEffect, useState, useRef } from 'react';

export default function ServerModal({ onClose }: { onClose: () => void }) {
    const { detectedServerPath, setDetectedServerPath, serverRunning, setServerRunning, appendOutput } = useEditorContext();
    const [logs, setLogs] = useState<Array<{ type: string, text: string }>>([]);
    const logRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        
        const unsubLog = window.api.onServerLog((entry) => {
            setLogs(prev => [...prev, entry]);
        });

        const unsubStatus = window.api.onServerStatusChange((running) => {
            setServerRunning(running);
        });

        return () => {
            
        };
    }, [setServerRunning]);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs]);

    const handleStart = async () => {
        if (!detectedServerPath) return;
        const res = await window.api.startServer(detectedServerPath);
        if (!res.success) appendOutput(`Failed to start server: ${res.error}`, 'error');
    };

    const handleStop = async () => {
        await window.api.stopServer();
    };

    const handleRestart = async () => {
        if (!detectedServerPath) return;
        await window.api.restartServer(detectedServerPath);
    };

    const browseServer = async () => {
        const path = await window.api.browseForFile({
            title: 'Select Server Executable',
            filters: [{ name: 'Executables', extensions: ['exe'] }]
        });
        if (path) setDetectedServerPath(path);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal wide" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">Server Manager</div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body overflow-hidden">
                    <div className="server-info-row">
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>Server Control</div>
                            <div className="server-path-display">{detectedServerPath || 'Not detected'}</div>
                        </div>
                        <div className={`server-badge ${serverRunning ? 'online' : ''}`}>
                            {serverRunning ? 'ONLINE' : 'OFFLINE'}
                        </div>
                    </div>

                    <div className="server-controls">
                        <button className="btn-server-control start" disabled={serverRunning || !detectedServerPath} onClick={handleStart}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Start Server
                        </button>
                        <button className="btn-server-control stop" disabled={!serverRunning} onClick={handleStop}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="3" width="18" height="18" />
                            </svg>
                            Stop
                        </button>
                        <button className="btn-server-control restart" disabled={!detectedServerPath} onClick={handleRestart}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Restart
                        </button>
                        <button className="btn-server-action" onClick={browseServer}>Change Path</button>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase' }}>Console Output</span>
                            <button className="btn-server-action" style={{ padding: '2px 8px' }} onClick={() => setLogs([])}>Clear</button>
                        </div>
                        <div className="server-log" ref={logRef as any}>
                            {logs.map((log, i) => (
                                <div key={i} className={`server-log-line ${log.type}`}>{log.text}</div>
                            ))}
                            {logs.length === 0 && <div className="server-log-placeholder">Waiting for server logs...</div>}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
