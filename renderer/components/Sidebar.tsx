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
    const { currentFolderPath, setCurrentFolderPath } = useEditorContext();
    const { openFolder, openFileByPath } = useFileOperations();
    const [tree, setTree] = useState<FileTreeItem[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

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
    }, [currentFolderPath, loadTree]);

    
    useEffect(() => {
        if (!window.api) return;
        window.api.onFolderChange(() => {
            if (currentFolderPath) loadTree(currentFolderPath);
        });
    }, [currentFolderPath, loadTree]);

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
                    <SubTree path={item.path} level={level + 1} toggleFolder={toggleFolder} expandedFolders={expandedFolders} openFileByPath={openFileByPath} onContextMenu={onExplorerContextMenu} />
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className="sidebar" style={{ width: `${width}px` }}>
            <div className="sidebar-header">
                <span>EXPLORER</span>
                <div className="sidebar-actions">
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

function SubTree({ path, level, toggleFolder, expandedFolders, openFileByPath, onContextMenu }: any) {
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
    }, [path]);

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
