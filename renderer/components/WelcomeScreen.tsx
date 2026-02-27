'use client';

import { useFileOperations } from '../hooks/useFileOperations';

export default function WelcomeScreen() {
    const { newFile, openFile, openFolder } = useFileOperations();

    return (
        <div className="welcome-screen">
            <div className="welcome-logo">
                <img src="./assets/icon-256.png" alt="DAWNO" />
            </div>
            <h1>DAWNO</h1>
            <p>SA-MP PAWN Editor</p>
            <div className="welcome-actions">
                <button className="welcome-btn primary" onClick={() => newFile()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    New File
                </button>
                <button className="welcome-btn" onClick={() => openFile()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Open File
                </button>
                <button className="welcome-btn" onClick={() => openFolder()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        <line x1="12" y1="11" x2="12" y2="17" /><polyline points="9 14 12 17 15 14" />
                    </svg>
                    Open Folder
                </button>
            </div>
            <p className="welcome-tip">
                Press <kbd>Ctrl+N</kbd> for new file, <kbd>Ctrl+O</kbd> to open, <kbd>F5</kbd> to compile
            </p>
        </div>
    );
}
