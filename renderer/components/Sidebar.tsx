'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';

interface FileTreeItem {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileTreeItem[];
}

interface SidebarProps {
    width: number;
    onExplorerContextMenu: (x: number, y: number, path: string, isDirectory: boolean) => void;
}

export default function Sidebar({ width, onExplorerContextMenu }: SidebarProps) {
    const { currentFolderPath, setCurrentFolderPath, appendOutput } = useEditorContext();
    const { openFolder, openFileByPath } = useFileOperations();
    const [tree, setTree] = useState<FileTreeItem[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [refreshKey, setRefreshKey] = useState(0);

    const loadTree = useCallback(async (folderPath: string) => {
        if (!window.api) return;
        const items = await window.api.readDirectory(folderPath);
        if (items) {
            const sorted = items.sort((a, b) => {
                if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
                return a.isDirectory ? -1 : 1;
            });
            setTree(sorted as FileTreeItem[]);
        }
    }, []);

    useEffect(() => {
        if (currentFolderPath) {
            loadTree(currentFolderPath);
        } else {
            setTree([]);
        }
    }, [currentFolderPath, loadTree, refreshKey]);

    useEffect(() => {
        if (!window.api) return;
        const unsubscribe = window.api.onFolderChange((data) => {
            setRefreshKey(prev => prev + 1);
        });
        return () => {
            // Unsubscribe if bridge supports it, but for now we just let it refresh.
        };
    }, []);

    const handleNewFile = async () => {
        if (!currentFolderPath) return;
        const name = prompt('File name:');
        if (name) {
            const res = await window.api.createFile(`${currentFolderPath}/${name}`);
            if (!res.success) appendOutput(`Error: ${res.error}`, 'error');
            else setRefreshKey(prev => prev + 1);
        }
    };

    const handleNewFolder = async () => {
        if (!currentFolderPath) return;
        const name = prompt('Folder name:');
        if (name) {
            const res = await window.api.createFolder(`${currentFolderPath}/${name}`);
            if (!res.success) appendOutput(`Error: ${res.error}`, 'error');
            else setRefreshKey(prev => prev + 1);
        }
    };

    const toggleFolder = (path: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    };

    const renderTree = (items: FileTreeItem[], level = 0) => {
        return items.map(item => (
            <React.Fragment key={item.path}>
                <div
                    className="tree-item"
                    style={{ paddingLeft: `${level * 12 + 12}px` }}
                    onClick={() => {
                        if (item.isDirectory) toggleFolder(item.path);
                        else openFileByPath(item.path);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        onExplorerContextMenu(e.clientX, e.clientY, item.path, item.isDirectory);
                    }}
                >
                    {item.isDirectory ? (
                        <>
                            <svg className={`chevron ${expandedFolders.has(item.path) ? 'expanded' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                            <svg className="folder-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                            </svg>
                        </>
                    ) : (
                        <svg className="file-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    )}
                    <span className="tab-name">{item.name}</span>
                </div>
                {item.isDirectory && expandedFolders.has(item.path) && (
                    <SubTree
                        path={item.path}
                        level={level + 1}
                        toggleFolder={toggleFolder}
                        expandedFolders={expandedFolders}
                        openFileByPath={openFileByPath}
                        onContextMenu={onExplorerContextMenu}
                        refreshKey={refreshKey}
                    />
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className="sidebar" style={{ width: `${width}px` }}>
            <div className="sidebar-header">
                <span>EXPLORER</span>
                <div className="sidebar-actions">
                    {currentFolderPath && (
                        <>
                            <button className="sidebar-action-btn" title="New File" onClick={handleNewFile}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                    <line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
                                </svg>
                            </button>
                            <button className="sidebar-action-btn" title="New Folder" onClick={handleNewFolder}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    <line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
                                </svg>
                            </button>
                            <button className="sidebar-action-btn" title="Refresh" onClick={() => setRefreshKey(k => k + 1)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                            </button>
                        </>
                    )}
                    <button className="sidebar-action-btn" title="Close Folder" onClick={() => setCurrentFolderPath(null)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="sidebar-content">
                {currentFolderPath ? (
                    renderTree(tree)
                ) : (
                    <div className="sidebar-placeholder">
                        <p>No folder open</p>
                        <button className="welcome-btn mini primary" onClick={openFolder}>Open Folder</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function SubTree({ path, level, toggleFolder, expandedFolders, openFileByPath, onContextMenu, refreshKey }: any) {
    const [items, setItems] = useState<FileTreeItem[]>([]);

    useEffect(() => {
        if (!window.api) return;
        window.api.readDirectory(path).then(res => {
            if (res) {
                setItems(res.sort((a, b) => {
                    if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
                    return a.isDirectory ? -1 : 1;
                }) as FileTreeItem[]);
            }
        });
    }, [path, refreshKey]);

    return (
        <>
            {items.map(item => (
                <React.Fragment key={item.path}>
                    <div
                        className="tree-item"
                        style={{ paddingLeft: `${level * 12 + 12}px` }}
                        onClick={() => {
                            if (item.isDirectory) toggleFolder(item.path);
                            else openFileByPath(item.path);
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            onContextMenu(e.clientX, e.clientY, item.path, item.isDirectory);
                        }}
                    >
                        {item.isDirectory ? (
                            <>
                                <svg className={`chevron ${expandedFolders.has(item.path) ? 'expanded' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                                <svg className="folder-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                                </svg>
                            </>
                        ) : (
                            <svg className="file-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        )}
                        <span className="tab-name">{item.name}</span>
                    </div>
                    {item.isDirectory && expandedFolders.has(item.path) && (
                        <SubTree path={item.path} level={level + 1} toggleFolder={toggleFolder} expandedFolders={expandedFolders} openFileByPath={openFileByPath} onContextMenu={onContextMenu} />
                    )}
                </React.Fragment>
            ))}
        </>
    );
}
