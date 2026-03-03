'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { useFileOperations } from '../hooks/useFileOperations';
import InlineInput from './InlineInput';
import SourceControlPanel from './SourceControlPanel';

interface FileTreeItem {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileTreeItem[];
}

interface SidebarProps {
    width: number;
    onExplorerContextMenu: (x: number, y: number, path: string, isDirectory: boolean) => void;
    activePanel: 'explorer' | 'sourceControl';
}

type InlineInputState = { mode: 'new-file' | 'new-folder'; parentPath: string } | null;

export default function Sidebar({ width, onExplorerContextMenu, activePanel }: SidebarProps) {
    const { currentFolderPath, setCurrentFolderPath, appendOutput, shouldPreventFocus } = useEditorContext();
    const { openFolder, openFileByPath } = useFileOperations();
    const [tree, setTree] = useState<FileTreeItem[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [inlineInput, setInlineInput] = useState<InlineInputState>(null);

    // Drag & drop state
    const draggedPath = useRef<string | null>(null);
    const [dragOverPath, setDragOverPath] = useState<string | null>(null);

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
        const cleanup = window.api.onFolderChange(() => {
            setRefreshKey(prev => prev + 1);
        });
        return () => {
            if (typeof cleanup === 'function') cleanup();
        };
    }, []);

    const handleNewFile = async () => {
        if (!currentFolderPath || !window.api) return;
        let parent = currentFolderPath;
        if (selectedPath) {
            try {
                const stats = await window.api.getStats(selectedPath);
                if (stats.isDirectory) {
                    parent = selectedPath;
                } else {
                    parent = selectedPath.split(/[\\/]/).slice(0, -1).join('\\');
                }
            } catch (e) { }
        }
        setInlineInput({ mode: 'new-file', parentPath: parent });
    };

    const handleNewFolder = async () => {
        if (!currentFolderPath || !window.api) return;
        let parent = currentFolderPath;
        if (selectedPath) {
            try {
                const stats = await window.api.getStats(selectedPath);
                if (stats.isDirectory) {
                    parent = selectedPath;
                } else {
                    parent = selectedPath.split(/[\\/]/).slice(0, -1).join('\\');
                }
            } catch (e) { }
        }
        setInlineInput({ mode: 'new-folder', parentPath: parent });
    };

    const handleInlineConfirm = async (name: string) => {
        if (!inlineInput) return;
        const newPath = `${inlineInput.parentPath}\\${name}`;
        if (inlineInput.mode === 'new-file') {
            const res = await window.api.createFile(newPath);
            if (!res.success) appendOutput(`Error: ${res.error}`, 'error');
            else setRefreshKey(prev => prev + 1);
        } else {
            const res = await window.api.createFolder(newPath);
            if (!res.success) appendOutput(`Error: ${res.error}`, 'error');
            else setRefreshKey(prev => prev + 1);
        }
        setInlineInput(null);
    };

    const toggleFolder = (path: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    };

    // Single click: select (highlight). Double click: open file / toggle folder
    const clickTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const handleItemClick = useCallback((item: FileTreeItem) => {
        setSelectedPath(item.path);

        if (clickTimers.current[item.path]) {
            // Double click - normal open with focus
            clearTimeout(clickTimers.current[item.path]);
            delete clickTimers.current[item.path];
            if (item.isDirectory) {
                toggleFolder(item.path);
            } else {
                openFileByPath(item.path);
            }
        } else {
            // Single click – select and open WITHOUT focus
            if (item.isDirectory) {
                toggleFolder(item.path);
            } else {
                shouldPreventFocus.current = true;
                openFileByPath(item.path);
            }

            clickTimers.current[item.path] = setTimeout(() => {
                delete clickTimers.current[item.path];
            }, 300);
        }
    }, [openFileByPath, shouldPreventFocus]);

    // Drag & Drop handlers
    const handleDragStart = useCallback((e: React.DragEvent, item: FileTreeItem) => {
        draggedPath.current = item.path;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.path);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, item: FileTreeItem) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedPath.current || draggedPath.current === item.path) return;
        e.dataTransfer.dropEffect = 'move';
        // Only allow dropping onto directories
        if (item.isDirectory) setDragOverPath(item.path);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOverPath(null);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent, item: FileTreeItem) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverPath(null);
        const src = draggedPath.current;
        draggedPath.current = null;
        if (!src || src === item.path) return;

        // Target must be a directory
        const targetDir = item.isDirectory ? item.path : item.path.split(/[\\/]/).slice(0, -1).join('\\');
        const fileName = src.split(/[\\/]/).pop()!;
        const dest = `${targetDir}\\${fileName}`;
        if (src === dest) return;

        const res = await window.api.moveFile({ src, dest });
        if (!res.success) {
            appendOutput(`Error moving: ${res.error}`, 'error');
        } else {
            setRefreshKey(prev => prev + 1);
        }
    }, [appendOutput]);

    const handleDragEnd = useCallback(() => {
        draggedPath.current = null;
        setDragOverPath(null);
    }, []);

    const renderTree = (items: FileTreeItem[], level = 0) => {
        return items.map(item => (
            <React.Fragment key={item.path}>
                <div
                    className={`tree-item${selectedPath === item.path ? ' selected' : ''}${dragOverPath === item.path ? ' drag-over' : ''}`}
                    style={{ paddingLeft: `${level * 12 + 12}px` }}
                    onClick={() => handleItemClick(item)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedPath(item.path);
                        onExplorerContextMenu(e.clientX, e.clientY, item.path, item.isDirectory);
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => handleDragOver(e, item)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, item)}
                    onDragEnd={handleDragEnd}
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
                        selectedPath={selectedPath}
                        setSelectedPath={setSelectedPath}
                        openFileByPath={openFileByPath}
                        onContextMenu={onExplorerContextMenu}
                        refreshKey={refreshKey}
                        dragOverPath={dragOverPath}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        shouldPreventFocus={shouldPreventFocus}
                    />
                )}
            </React.Fragment>
        ));
    };

    const getNewItemParentPath = () => {
        if (!selectedPath) return currentFolderPath || '';
        // If selectedPath is one of the tree items, check if it's a directory
        const findInTree = (items: FileTreeItem[]): FileTreeItem | null => {
            for (const it of items) {
                if (it.path === selectedPath) return it;
                if (it.children) {
                    const found = findInTree(it.children);
                    if (found) return found;
                }
            }
            return null;
        };
        // This is tricky because tree is only top-level. 
        // We'll trust ExplorerContextMenu.tsx for the exact logic,
        // but here we can at least try to be smart.
        return selectedPath; // Placeholder, refined below
    };

    const handleNewFileCorrected = () => {
        if (!currentFolderPath) return;
        // The most reliable way is for the user to right-click. 
        // But if they click the button, we use selectedPath.
        // We actually need to know if selectedPath is a directory or file.
        // Let's pass a function to get the parent of ANY path.
        onExplorerContextMenu(0, 0, selectedPath || currentFolderPath, true); // Trigger context menu internally or just handle it.
        // Actually, let's just fix handleNewFile to prompt correctly.
    };

    return (
        <>
            {activePanel === 'sourceControl' ? (
                <div className="sidebar" style={{ width: `${width}px` }}>
                    <SourceControlPanel />
                </div>
            ) : (
                <>
                    {inlineInput && (
                        <InlineInput
                            defaultValue=""
                            placeholder={inlineInput.mode === 'new-file' ? 'File name (e.g. script.pwn)' : 'Folder name...'}
                            onConfirm={handleInlineConfirm}
                            onCancel={() => setInlineInput(null)}
                        />
                    )}
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
                </>
            )}
        </>
    );

}

function SubTree({ path, level, toggleFolder, expandedFolders, selectedPath, setSelectedPath, openFileByPath, onContextMenu, refreshKey, dragOverPath, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd, shouldPreventFocus }: any) {
    const [items, setItems] = useState<FileTreeItem[]>([]);
    const clickTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        if (!window.api) return;
        window.api.readDirectory(path).then((res: any) => {
            if (res) {
                setItems(res.sort((a: FileTreeItem, b: FileTreeItem) => {
                    if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
                    return a.isDirectory ? -1 : 1;
                }) as FileTreeItem[]);
            }
        });
    }, [path, refreshKey]);

    const handleItemClick = (item: FileTreeItem) => {
        setSelectedPath(item.path);
        if (clickTimers.current[item.path]) {
            clearTimeout(clickTimers.current[item.path]);
            delete clickTimers.current[item.path];
            if (item.isDirectory) {
                toggleFolder(item.path);
            } else {
                openFileByPath(item.path);
            }
        } else {
            if (item.isDirectory) {
                toggleFolder(item.path);
            } else {
                if (shouldPreventFocus) shouldPreventFocus.current = true;
                openFileByPath(item.path);
            }
            clickTimers.current[item.path] = setTimeout(() => {
                delete clickTimers.current[item.path];
            }, 300);
        }
    };

    return (
        <>
            {items.map(item => (
                <React.Fragment key={item.path}>
                    <div
                        className={`tree-item${selectedPath === item.path ? ' selected' : ''}${dragOverPath === item.path ? ' drag-over' : ''}`}
                        style={{ paddingLeft: `${level * 12 + 12}px` }}
                        onClick={() => handleItemClick(item)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setSelectedPath(item.path);
                            onContextMenu(e.clientX, e.clientY, item.path, item.isDirectory);
                        }}
                        draggable
                        onDragStart={(e: React.DragEvent) => onDragStart(e, item)}
                        onDragOver={(e: React.DragEvent) => onDragOver(e, item)}
                        onDragLeave={onDragLeave}
                        onDrop={(e: React.DragEvent) => onDrop(e, item)}
                        onDragEnd={onDragEnd}
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
                            selectedPath={selectedPath}
                            setSelectedPath={setSelectedPath}
                            openFileByPath={openFileByPath}
                            onContextMenu={onContextMenu}
                            refreshKey={refreshKey}
                            dragOverPath={dragOverPath}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onDragEnd={onDragEnd}
                            shouldPreventFocus={shouldPreventFocus}
                        />
                    )}
                </React.Fragment>
            ))}
        </>
    );
}
