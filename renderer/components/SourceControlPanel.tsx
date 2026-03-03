'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';
import { useLanguage } from '../i18n/LanguageContext';
import GitDiffModal from './GitDiffModal';

interface GitFile {
    file: string;
    status: string;
}

interface GitStatus {
    staged: GitFile[];
    unstaged: GitFile[];
    untracked: GitFile[];
    ignoredFiles: string[];
}

interface DiffTarget {
    file: string;
    staged: boolean;
    isUntracked?: boolean;
    commitHash?: string;
}

// Untracked rendered as "U" (like VSCode), not "?"
const STATUS_LABELS: Record<string, string> = {
    M: 'M', A: 'A', D: 'D', R: 'R', C: 'C', U: 'U', '?': 'U'
};
const STATUS_TITLES: Record<string, string> = {
    M: 'Modified', A: 'Added', D: 'Deleted', R: 'Renamed', C: 'Copied', U: 'Unmerged', '?': 'Untracked'
};

function statusColor(s: string) {
    if (s === 'M') return 'var(--git-modified)';
    if (s === 'A') return 'var(--git-added)';
    if (s === 'D') return 'var(--git-deleted)';
    if (s === 'U') return 'var(--git-conflict)';
    if (s === '?') return 'var(--git-added)'; // untracked = green U
    return 'var(--text-2)';
}

function basename(p: string) {
    return p.replace(/\\/g, '/').split('/').pop() ?? p;
}
function parentPath(p: string) {
    const parts = p.replace(/\\/g, '/').split('/');
    return parts.length > 1 ? parts.slice(0, -1).join('/') : '';
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

interface CtxMenuProps {
    x: number;
    y: number;
    item: GitFile;
    section: 'staged' | 'unstaged' | 'untracked';
    cwd: string;
    onClose: () => void;
    onRefresh: () => void;
    onDiff: (target: DiffTarget) => void;
    appendOutput: (text: string, type?: 'info' | 'error' | 'warning' | 'success', clickable?: boolean, filePath?: string | null) => void;
    openFileByPath: (path: string) => void;
    isIgnored?: boolean;
}

function ScContextMenu({ x, y, item, section, cwd, onClose, onRefresh, onDiff, appendOutput, openFileByPath, isIgnored }: CtxMenuProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    // Adjust position so menu doesn't go off-screen
    const style: React.CSSProperties = {
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 9999,
    };

    const fullPath = `${cwd}\\${item.file.replace(/\//g, '\\')}`;

    const actions = {
        openChanges: () => {
            onDiff({ file: item.file, staged: section === 'staged', isUntracked: section === 'untracked' });
            onClose();
        },
        openFile: async () => {
            openFileByPath(fullPath);
            onClose();
        },
        openFileHead: async () => {
            const res = await window.api.gitOpenFileHead(cwd, item.file);
            if (res.success && res.content !== undefined) {
                appendOutput(`[HEAD] ${item.file}:\n${res.content}`, 'info');
            } else {
                appendOutput(`Git: Could not open HEAD version: ${res.error}`, 'error');
            }
            onClose();
        },
        discard: async () => {
            const res = await window.api.gitDiscard(cwd, item.file);
            if (!res.success) appendOutput(`Git: ${res.error}`, 'error');
            onRefresh(); onClose();
        },
        stage: async () => {
            const res = await window.api.gitAdd(cwd, item.file);
            if (!res.success) appendOutput(`Git: ${res.error}`, 'error');
            onRefresh(); onClose();
        },
        unstage: async () => {
            const res = await window.api.gitUnstage(cwd, item.file);
            if (!res.success) appendOutput(`Git: ${res.error}`, 'error');
            onRefresh(); onClose();
        },
        addToGitignore: async () => {
            const res = await window.api.gitAddGitignore(cwd, item.file);
            if (res.success) appendOutput(`Added "${item.file}" to .gitignore`, 'success');
            else appendOutput(`Git: ${res.error}`, 'error');
            onRefresh(); onClose();
        },
        removeFromGitignore: async () => {
            const res = await window.api.gitRemoveGitignore(cwd, item.file);
            if (res.success) appendOutput(`Removed "${item.file}" from .gitignore`, 'success');
            else appendOutput(`Git: ${res.error}`, 'error');
            onRefresh(); onClose();
        },
        revealInFileExplorer: async () => {
            await window.api.revealInExplorer(fullPath);
            onClose();
        },
        revealInExplorerView: () => {
            // Switch to explorer panel — not yet wired, just close and show message
            appendOutput(`Reveal in Explorer: ${item.file}`, 'info');
            onClose();
        },
    };

    return (
        <div ref={ref} className="sc-ctx-menu" style={style}>
            <button className="sc-ctx-item" onClick={actions.openChanges}>{t.sourceControl.openChanges}</button>
            <button className="sc-ctx-item" onClick={actions.openFile}>{t.sourceControl.openFile}</button>
            {section !== 'untracked' && (
                <button className="sc-ctx-item" onClick={actions.openFileHead}>{t.sourceControl.openFileHead}</button>
            )}
            <div className="sc-ctx-sep" />
            {section !== 'staged' && (
                <button className="sc-ctx-item sc-ctx-danger" onClick={actions.discard}>{t.sourceControl.discardChanges}</button>
            )}
            {section !== 'staged' && (
                <button className="sc-ctx-item" onClick={actions.stage}>{t.sourceControl.stageChanges}</button>
            )}
            {section === 'staged' && (
                <button className="sc-ctx-item" onClick={actions.unstage}>{t.sourceControl.unstageChanges}</button>
            )}
            {isIgnored ? (
                <button className="sc-ctx-item" onClick={actions.removeFromGitignore}>{t.sourceControl.removeFromGitignore}</button>
            ) : (
                <button className="sc-ctx-item" onClick={actions.addToGitignore}>{t.sourceControl.addToGitignore}</button>
            )}
            <div className="sc-ctx-sep" />
            <button className="sc-ctx-item" onClick={actions.revealInFileExplorer}>{t.sourceControl.revealInFileExplorer}</button>
            <button className="sc-ctx-item" onClick={actions.revealInExplorerView}>{t.sourceControl.revealInExplorerView}</button>
        </div>
    );
}

// ─── File Row ─────────────────────────────────────────────────────────────────

interface FileRowProps {
    item: GitFile;
    section: 'staged' | 'unstaged' | 'untracked';
    cwd: string;
    onRefresh: () => void;
    onDiff: (target: DiffTarget) => void;
    appendOutput: (text: string, type?: 'info' | 'error' | 'warning' | 'success', clickable?: boolean, filePath?: string | null) => void;
    openFileByPath: (path: string) => void;
    isIgnored?: boolean;
}

function FileRow({ item, section, cwd, onRefresh, onDiff, appendOutput, openFileByPath, isIgnored }: FileRowProps) {
    const [hovering, setHovering] = useState(false);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCtxMenu({ x: e.clientX, y: e.clientY });
    };

    const handleStage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const res = await window.api.gitAdd(cwd, item.file);
        if (!res.success) appendOutput(`Git: ${res.error}`, 'error');
        onRefresh();
    };
    const handleUnstage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const res = await window.api.gitUnstage(cwd, item.file);
        if (!res.success) appendOutput(`Git: ${res.error}`, 'error');
        onRefresh();
    };
    const handleDiscard = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const res = await window.api.gitDiscard(cwd, item.file);
        if (!res.success) appendOutput(`Git: ${res.error}`, 'error');
        onRefresh();
    };

    const parent = parentPath(item.file);
    const name = basename(item.file);

    return (
        <>
            <div
                className="sc-file-row"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={() => onDiff({ file: item.file, staged: section === 'staged', isUntracked: section === 'untracked' })}
                onContextMenu={handleContextMenu}
                title={item.file}
            >
                <span
                    className="sc-badge"
                    style={{ color: statusColor(item.status) }}
                    title={STATUS_TITLES[item.status] ?? item.status}
                >
                    {STATUS_LABELS[item.status] ?? item.status}
                </span>
                <div className="sc-file-info">
                    <span className="sc-file-name">{name}</span>
                    {parent && <span className="sc-file-parent">{parent}</span>}
                </div>
                {hovering && (
                    <div className="sc-row-actions">
                        {section === 'staged' && (
                            <button className="sc-action-btn" title="Unstage Changes" onClick={handleUnstage}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                        )}
                        {(section === 'unstaged') && (
                            <>
                                <button className="sc-action-btn" title="Stage Changes" onClick={handleStage}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                                <button className="sc-action-btn sc-action-danger" title="Discard Changes" onClick={handleDiscard}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                        <path d="M3 3v5h5" />
                                    </svg>
                                </button>
                            </>
                        )}
                        {section === 'untracked' && (
                            <button className="sc-action-btn" title="Stage File" onClick={handleStage}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {ctxMenu && (
                <ScContextMenu
                    x={ctxMenu.x}
                    y={ctxMenu.y}
                    item={item}
                    section={section}
                    cwd={cwd}
                    onClose={() => setCtxMenu(null)}
                    onRefresh={onRefresh}
                    onDiff={onDiff}
                    appendOutput={appendOutput}
                    openFileByPath={openFileByPath}
                    isIgnored={isIgnored}
                />
            )}
        </>
    );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface SectionProps {
    title: string;
    count: number;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

function Section({ title, count, expanded, onToggle, children, actions }: SectionProps) {
    return (
        <div className="sc-section">
            <div className="sc-section-header" onClick={onToggle}>
                <svg
                    className={`sc-chevron${expanded ? ' expanded' : ''}`}
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="sc-section-title">{title}</span>
                <span className="sc-section-count">{count}</span>
                {actions && <div className="sc-section-actions" onClick={e => e.stopPropagation()}>{actions}</div>}
            </div>
            {expanded && <div className="sc-section-body">{children}</div>}
        </div>
    );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export default function SourceControlPanel() {
    const { currentFolderPath, appendOutput } = useEditorContext();
    const { openFileByPath } = useFileOperations();
    const { t } = useLanguage();

    const [status, setStatus] = useState<GitStatus | null>(null);
    const [notGitRepo, setNotGitRepo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [commitMsg, setCommitMsg] = useState('');
    const [committing, setCommitting] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [syncMsg, setSyncMsg] = useState('');

    const [showStaged, setShowStaged] = useState(true);
    const [showUnstaged, setShowUnstaged] = useState(true);
    const [showUntracked, setShowUntracked] = useState(true);
    const [showLog, setShowLog] = useState(false);
    const [showOutgoing, setShowOutgoing] = useState(true);
    const [showIncoming, setShowIncoming] = useState(true);
    const [commits, setCommits] = useState<{ hash: string; message: string }[]>([]);
    const [outgoingCommits, setOutgoingCommits] = useState<{ hash: string; message: string }[]>([]);
    const [incomingCommits, setIncomingCommits] = useState<{ hash: string; message: string }[]>([]);
    const [syncState, setSyncState] = useState({ incoming: 0, outgoing: 0 });

    const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
    const [loadingCommit, setLoadingCommit] = useState(false);
    const [commitDetails, setCommitDetails] = useState<any>(null);

    const [diffTarget, setDiffTarget] = useState<DiffTarget | null>(null);

    const refresh = useCallback(async () => {
        if (!currentFolderPath || !window.api) return;
        setLoading(true);
        const res = await window.api.gitStatus(currentFolderPath);
        setLoading(false);
        if (res.notGitRepo) { setNotGitRepo(true); setStatus(null); return; }
        if (res.success) {
            setNotGitRepo(false);
            setStatus({
                staged: res.staged || [],
                unstaged: res.unstaged || [],
                untracked: res.untracked || [],
                ignoredFiles: res.ignoredFiles || []
            } as GitStatus);
        }

        // Always fetch the latest log so the "Commits" panel immediately reflects new commits
        const logRes = await window.api.gitGetLog(currentFolderPath);
        if (logRes.success) setCommits(logRes.commits);

        // Fetch sync status (incoming/outgoing commits with full lists)
        const syncRes = await window.api.gitGetSyncStatus(currentFolderPath);
        if (syncRes.success) {
            setSyncState({ incoming: syncRes.incoming, outgoing: syncRes.outgoing });
            setOutgoingCommits(syncRes.outgoingCommits ?? []);
            setIncomingCommits(syncRes.incomingCommits ?? []);
        }
    }, [currentFolderPath]);

    useEffect(() => {
        setStatus(null); setNotGitRepo(false); setCommitMsg(''); setSyncMsg('');
        refresh();
    }, [currentFolderPath, refresh]);

    useEffect(() => {
        const timer = setInterval(() => refresh(), 5000);
        return () => clearInterval(timer);
    }, [refresh]);

    const handleInit = async () => {
        if (!currentFolderPath) return;
        const res = await window.api.gitInit(currentFolderPath);
        if (res.success) refresh();
        else appendOutput(`Git init failed: ${res.error}`, 'error');
    };

    const handleStageAll = async () => {
        if (!currentFolderPath) return;
        await window.api.gitAdd(currentFolderPath, 'ALL');
        refresh();
    };

    const handleUnstageAll = async () => {
        if (!currentFolderPath || !status) return;
        for (const f of status.staged) await window.api.gitUnstage(currentFolderPath, f.file);
        refresh();
    };

    const handleCommit = async () => {
        if (!currentFolderPath || !commitMsg.trim()) return;
        setCommitting(true);

        try {
            const freshStatus = await window.api.gitStatus(currentFolderPath);
            const hasStaged = freshStatus.success && (freshStatus.staged?.length ?? 0) > 0;
            const hasPending = freshStatus.success && (
                (freshStatus.unstaged?.length ?? 0) > 0 ||
                (freshStatus.untracked?.length ?? 0) > 0
            );

            // VSCode behavior: if nothing staged but there are working-tree changes, stage all first
            if (!hasStaged) {
                if (!hasPending) {
                    appendOutput('Git: Nothing to commit.', 'info');
                    return;
                }
                const addRes = await window.api.gitAdd(currentFolderPath, 'ALL');
                if (!addRes.success) {
                    appendOutput(`Git add failed: ${addRes.error}`, 'error');
                    return;
                }
            }

            let res = await window.api.gitCommit(currentFolderPath, commitMsg.trim());

            // Fallback: if commit reports "no changes added", stage everything and retry once
            if (!res.success && (res.error + (res.output ?? '')).includes('no changes added')) {
                await window.api.gitAdd(currentFolderPath, 'ALL');
                res = await window.api.gitCommit(currentFolderPath, commitMsg.trim());
            }

            if (res.success) {
                setCommitMsg('');
                appendOutput(`Git: ${res.output}`, 'success');
                refresh();
            } else {
                appendOutput(`Git commit failed: ${res.error || res.output}`, 'error');
            }
        } catch (e: any) {
            appendOutput(`Git commit error: ${e.message}`, 'error');
        } finally {
            setCommitting(false);
        }
    };


    const handlePull = async () => {
        if (!currentFolderPath) return;
        setSyncing(true); setSyncMsg(t.sourceControl.pulling);
        const res = await window.api.gitPull(currentFolderPath);
        setSyncing(false); setSyncMsg('');
        if (res.success) { appendOutput(`Git pull: ${res.output}`, 'success'); refresh(); }
        else appendOutput(`Git pull failed: ${res.error || res.output}`, 'error');
    };

    const handlePush = async () => {
        if (!currentFolderPath) return;
        setSyncing(true); setSyncMsg(t.sourceControl.pushing);
        const res = await window.api.gitPush(currentFolderPath);
        setSyncing(false); setSyncMsg('');
        if (res.success) appendOutput(`Git push: ${res.output}`, 'success');
        else appendOutput(`Git push failed: ${res.error || res.output}`, 'error');
    };

    const handleStash = async () => {
        if (!currentFolderPath) return;
        const res = await window.api.gitStash(currentFolderPath);
        if (res.success) { appendOutput(`Git stash: ${res.output}`, 'success'); refresh(); }
        else appendOutput(`Git stash failed: ${res.error}`, 'error');
    };

    const handleStashPop = async () => {
        if (!currentFolderPath) return;
        const res = await window.api.gitStashPop(currentFolderPath);
        if (res.success) { appendOutput(`Git stash pop: ${res.output}`, 'success'); refresh(); }
        else appendOutput(`Git stash pop failed: ${res.error}`, 'error');
    };

    const handleShowLog = async () => {
        const next = !showLog;
        setShowLog(next);
        if (next && currentFolderPath) {
            const res = await window.api.gitGetLog(currentFolderPath);
            if (res.success) setCommits(res.commits);
        }
    };

    const handleCommitClick = async (hash: string) => {
        if (!currentFolderPath) return;
        setSelectedCommit(hash);
        setLoadingCommit(true);
        const res = await window.api.gitShowCommit(currentFolderPath, hash);
        setLoadingCommit(false);
        if (res.success) {
            setCommitDetails(res);
        } else {
            setCommitDetails(null);
            appendOutput(`Failed to fetch commit details: ${res.error}`, 'error');
        }
    };

    const handleOpenFile = useCallback((filePath: string) => {
        if (openFileByPath) openFileByPath(filePath);
    }, [openFileByPath]);

    const totalChanges = status
        ? status.staged.length + status.unstaged.length + status.untracked.length
        : 0;

    if (!currentFolderPath) {
        return (
            <div className="sc-panel">
                <div className="sc-panel-header"><span>{t.sourceControl.title}</span></div>
                <div className="sc-placeholder"><p>{t.sourceControl.noFolderOpen}</p></div>
            </div>
        );
    }

    if (notGitRepo) {
        return (
            <div className="sc-panel">
                <div className="sc-panel-header"><span>{t.sourceControl.title}</span></div>
                <div className="sc-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                        <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
                        <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" /><line x1="12" y1="12" x2="12" y2="15" />
                    </svg>
                    <p>{t.sourceControl.notGitRepo}</p>
                    <button className="sc-init-btn" onClick={handleInit}>{t.sourceControl.initRepo}</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="sc-panel">
                {/* Header */}
                <div className="sc-panel-header">
                    <span>{t.sourceControl.title}</span>
                    <div className="sc-header-actions">
                        <button className="sc-action-btn" title={t.sourceControl.pull} onClick={handlePull} disabled={syncing}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14" /><polyline points="19 12 12 19 5 12" />
                            </svg>
                        </button>
                        <button className="sc-action-btn" title={t.sourceControl.push} onClick={handlePush} disabled={syncing}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 19V5" /><polyline points="5 12 12 5 19 12" />
                            </svg>
                        </button>
                        <button className="sc-action-btn" title="Stage All Changes" onClick={handleStageAll}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </button>
                        <button className="sc-action-btn" title={t.sourceControl.stash} onClick={handleStash}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                        </button>
                        <button className="sc-action-btn" title={t.sourceControl.stashPop} onClick={handleStashPop}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="12 8 12 16" /><polyline points="8 12 12 8 16 12" />
                            </svg>
                        </button>
                        <button className="sc-action-btn" title={t.sourceControl.refresh} onClick={refresh}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {syncMsg && <div className="sc-sync-msg">{syncMsg}</div>}

                {/* Commit Input */}
                <div className="sc-commit-area">
                    <textarea
                        className="sc-commit-input"
                        placeholder={t.sourceControl.commitPlaceholder}
                        value={commitMsg}
                        onChange={e => setCommitMsg(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleCommit(); }}
                        rows={3}
                    />
                    <button
                        className={`sc-commit-btn${committing ? ' loading' : ''}`}
                        onClick={handleCommit}
                        disabled={committing || !commitMsg.trim()}
                        title={t.sourceControl.commit}
                    >
                        {committing ? <span className="sc-spinner" /> : t.sourceControl.commit}
                    </button>
                </div>

                {/* Content */}
                {loading && !status ? (
                    <div className="sc-loading"><span className="sc-spinner" /></div>
                ) : (
                    <div className="sc-sections">
                        {/* Staged */}
                        {status && status.staged.length > 0 && (
                            <Section
                                title={t.sourceControl.stagedChanges}
                                count={status.staged.length}
                                expanded={showStaged}
                                onToggle={() => setShowStaged(p => !p)}
                                actions={
                                    <button className="sc-action-btn" title={t.sourceControl.unstageAll} onClick={handleUnstageAll}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                }
                            >
                                {status.staged.map(f => (
                                    <FileRow key={`staged-${f.file}`} item={f} section="staged" cwd={currentFolderPath}
                                        onRefresh={refresh} onDiff={setDiffTarget} appendOutput={appendOutput} openFileByPath={handleOpenFile}
                                        isIgnored={status.ignoredFiles?.includes(f.file.replace(/\\/g, '/'))} />
                                ))}
                            </Section>
                        )}

                        {/* Unstaged (Changes) */}
                        {status && status.unstaged.length > 0 && (
                            <Section
                                title={t.sourceControl.changes}
                                count={status.unstaged.length}
                                expanded={showUnstaged}
                                onToggle={() => setShowUnstaged(p => !p)}
                                actions={
                                    <button className="sc-action-btn" title={t.sourceControl.stageAllChanges} onClick={handleStageAll}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                }
                            >
                                {status.unstaged.map(f => (
                                    <FileRow key={`unstaged-${f.file}`} item={f} section="unstaged" cwd={currentFolderPath}
                                        onRefresh={refresh} onDiff={setDiffTarget} appendOutput={appendOutput} openFileByPath={handleOpenFile}
                                        isIgnored={status.ignoredFiles?.includes(f.file.replace(/\\/g, '/'))} />
                                ))}
                            </Section>
                        )}

                        {/* Untracked */}
                        {status && status.untracked.length > 0 && (
                            <Section
                                title={t.sourceControl.untrackedFiles}
                                count={status.untracked.length}
                                expanded={showUntracked}
                                onToggle={() => setShowUntracked(p => !p)}
                                actions={
                                    <button className="sc-action-btn" title={t.sourceControl.stageAllUntracked} onClick={handleStageAll}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                }
                            >
                                {status.untracked.map(f => (
                                    <FileRow key={`untracked-${f.file}`} item={f} section="untracked" cwd={currentFolderPath}
                                        onRefresh={refresh} onDiff={setDiffTarget} appendOutput={appendOutput} openFileByPath={handleOpenFile}
                                        isIgnored={status.ignoredFiles?.includes(f.file.replace(/\\/g, '/'))} />
                                ))}
                            </Section>
                        )}

                    </div>
                )}
            </div>

            {/* History Pane — Outgoing / Incoming / Commits */}
            <div className="sc-history-pane">
                {/* Outgoing Commits (push pending) */}
                {outgoingCommits.length > 0 && (
                    <Section
                        title={t.sourceControl.outgoing}
                        count={outgoingCommits.length}
                        expanded={showOutgoing}
                        onToggle={() => setShowOutgoing(p => !p)}
                        actions={
                            <button className="sc-action-btn" title={t.sourceControl.push} onClick={handlePush} disabled={syncing}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                                </svg>
                            </button>
                        }
                    >
                        {outgoingCommits.map(c => (
                            <div
                                key={c.hash}
                                className="sc-commit-row sc-commit-outgoing"
                                title={c.hash}
                                onClick={() => handleCommitClick(c.hash)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="sc-commit-badge sc-commit-badge-out" title={t.sourceControl.pushPending}>↑</span>
                                <span className="sc-commit-hash">{c.hash.slice(0, 7)}</span>
                                <span className="sc-commit-msg">{c.message}</span>
                            </div>
                        ))}
                    </Section>
                )}

                {/* Incoming Commits (pull pending) */}
                {incomingCommits.length > 0 && (
                    <Section
                        title={t.sourceControl.incoming}
                        count={incomingCommits.length}
                        expanded={showIncoming}
                        onToggle={() => setShowIncoming(p => !p)}
                        actions={
                            <button className="sc-action-btn" title={t.sourceControl.pull} onClick={handlePull} disabled={syncing}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                                </svg>
                            </button>
                        }
                    >
                        {incomingCommits.map(c => (
                            <div
                                key={c.hash}
                                className="sc-commit-row sc-commit-incoming"
                                title={c.hash}
                                onClick={() => handleCommitClick(c.hash)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="sc-commit-badge sc-commit-badge-in" title={t.sourceControl.pullPending}>↓</span>
                                <span className="sc-commit-hash">{c.hash.slice(0, 7)}</span>
                                <span className="sc-commit-msg">{c.message}</span>
                            </div>
                        ))}
                    </Section>
                )}

                {/* Commits Log */}
                <Section
                    title={t.sourceControl.commits}
                    count={commits.length}
                    expanded={showLog}
                    onToggle={handleShowLog}
                >
                    {commits.length === 0 ? (
                        <div className="sc-no-commits">{t.sourceControl.noCommitsYet}</div>
                    ) : (
                        commits.map(c => (
                            <div
                                key={c.hash}
                                className="sc-commit-row clickable"
                                title={c.hash}
                                onClick={() => handleCommitClick(c.hash)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="sc-commit-hash">{c.hash.slice(0, 7)}</span>
                                <span className="sc-commit-msg">{c.message}</span>
                            </div>
                        ))
                    )}
                </Section>
            </div>

            {/* Commit Detail Modal/View */}
            {selectedCommit && (
                <div className="sc-commit-detail-overlay">
                    <div className="sc-commit-detail-modal">
                        <div className="sc-cd-header">
                            <h3>{t.sourceControl.commitDetails}</h3>
                            <button className="sc-close-btn" onClick={() => setSelectedCommit(null)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="sc-cd-body">
                            {loadingCommit ? (
                                <div className="sc-loading"><span className="sc-spinner" /></div>
                            ) : commitDetails ? (
                                <>
                                    <div className="sc-cd-info">
                                        <strong>{commitDetails.commitLine.split(' ')[0]}</strong>
                                        <p>{commitDetails.commitLine.substring(commitDetails.commitLine.indexOf(' ') + 1)}</p>
                                    </div>
                                    <div className="sc-cd-files">
                                        {commitDetails.files.map((f: any, i: number) => (
                                            <div
                                                key={i}
                                                className="sc-file-row"
                                                onClick={() => setDiffTarget({ file: f.path, staged: false, isUntracked: f.status === 'A', commitHash: selectedCommit })}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span className="sc-badge" style={{ color: statusColor(f.status) }}>{STATUS_LABELS[f.status] || f.status}</span>
                                                <div className="sc-file-info">
                                                    <span className="sc-file-name">{basename(f.path)}</span>
                                                    <span className="sc-file-parent">{parentPath(f.path)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="sc-placeholder"><p>{t.sourceControl.couldNotLoad}</p></div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Diff Modal */}
            {diffTarget && (
                <GitDiffModal
                    cwd={currentFolderPath}
                    file={diffTarget.file}
                    staged={diffTarget.staged}
                    isUntracked={diffTarget.isUntracked}
                    commitHash={diffTarget.commitHash}
                    onClose={() => setDiffTarget(null)}
                />
            )}
        </>
    );
}
