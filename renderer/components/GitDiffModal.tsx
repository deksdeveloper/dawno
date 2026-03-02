'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface GitDiffModalProps {
    cwd: string;
    file: string;
    staged: boolean;
    isUntracked?: boolean;
    commitHash?: string;
    onClose: () => void;
}

export default function GitDiffModal({ cwd, file, staged, isUntracked, commitHash, onClose }: GitDiffModalProps) {
    const [lines, setLines] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!window.api) return;

        const load = async () => {
            setLoading(true);

            if (isUntracked) {
                // Untracked: show file content with "+" prefix (like a new-file diff)
                try {
                    const fullPath = `${cwd}\\${file.replace(/\//g, '\\')}`;
                    const res = await window.api.readFile(fullPath, 'utf-8');
                    if (res.content !== null) {
                        const fileLines = (res.content ?? '').split('\n').map((l: string) => '+' + l);
                        setLines([
                            `diff --git a/${file} b/${file}`,
                            `--- /dev/null`,
                            `+++ b/${file}`,
                            `@@ -0,0 +1,${fileLines.length} @@`,
                            ...fileLines,
                        ]);
                    } else {
                        setLines(['(Could not read file)']);
                    }
                } catch {
                    setLines(['(Could not read file)']);
                }
            } else {
                const res = await window.api.gitGetDiff(cwd, file, staged, commitHash);
                if (res.success && res.diff && res.diff.trim()) {
                    setLines(res.diff.split('\n'));
                } else {
                    setLines(['(No diff available — file may not have changes)']);
                }
            }

            setLoading(false);
        };

        load();
    }, [cwd, file, staged, isUntracked, commitHash]);

    const getLineClass = (line: string) => {
        if (line.startsWith('+') && !line.startsWith('+++')) return 'diff-line diff-line-add';
        if (line.startsWith('-') && !line.startsWith('---')) return 'diff-line diff-line-del';
        if (line.startsWith('@@')) return 'diff-line diff-line-hunk';
        if (line.startsWith('diff ') || line.startsWith('index ') || line.startsWith('---') || line.startsWith('+++')) return 'diff-line diff-line-meta';
        return 'diff-line';
    };

    const modal = (
        <div className="git-diff-overlay" onClick={onClose}>
            <div className="git-diff-modal" onClick={e => e.stopPropagation()}>
                <div className="git-diff-header">
                    <div className="git-diff-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file}</span>
                        <span className="git-diff-staged-badge">
                            {isUntracked ? 'Untracked' : staged ? 'Staged' : 'Working Tree'}
                        </span>
                    </div>
                    <button className="git-diff-close-btn" onClick={onClose} title="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="git-diff-body">
                    {loading ? (
                        <div className="git-diff-loading">
                            <span className="sc-spinner" style={{ marginRight: 8 }} />
                            Loading diff...
                        </div>
                    ) : (
                        <pre className="git-diff-pre">
                            {lines.map((line, i) => (
                                <div key={i} className={getLineClass(line)}>
                                    <span className="diff-line-num">{i + 1}</span>
                                    <span className="diff-line-content">{line || '\u00a0'}</span>
                                </div>
                            ))}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );

    // Render into document.body so sidebar overflow:hidden doesn't clip the modal
    if (typeof document === 'undefined') return null;
    return createPortal(modal, document.body);
}
