'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import TitleBar from '../components/TitleBar';
import Sidebar from '../components/Sidebar';
import TabsBar from '../components/TabsBar';
import Toolbar from '../components/Toolbar';
import WelcomeScreen from '../components/WelcomeScreen';
import OutputPanel from '../components/OutputPanel';
import StatusBar from '../components/StatusBar';
import SettingsModal from '../components/modals/SettingsModal';
import ServerModal from '../components/modals/ServerModal';
import ConfigModal from '../components/modals/ConfigModal';
import EncodingPicker from '../components/modals/EncodingPicker';
import TabContextMenu from '../components/TabContextMenu';
import ExplorerContextMenu from '../components/ExplorerContextMenu';
import { useEditorContext } from '../context/EditorContext';
import { useSettings } from '../hooks/useSettings';
import { useFolderWatcher } from '../hooks/useFolderWatcher';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useNavigation } from '../hooks/useNavigation';
import { useEditorBridge } from '../hooks/useEditorBridge';
import { useDiscordRpc } from '../hooks/useDiscordRpc';

const EditorPanel = dynamic(() => import('../components/EditorPanel'), { ssr: false });

type SidebarPanel = 'explorer' | 'sourceControl';

export default function HomePage() {
  const ctx = useEditorContext();
  const { tabs, activeTabId, currentFolderPath } = ctx;

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [serverOpen, setServerOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [encodingPickerOpen, setEncodingPickerOpen] = useState(false);
  const [tabCtxMenu, setTabCtxMenu] = useState<{ x: number; y: number; tabId: number } | null>(null);
  const [explorerCtxMenu, setExplorerCtxMenu] = useState<{ x: number; y: number; path: string; isDirectory: boolean } | null>(null);
  const tabCtxMenuRef = useRef<HTMLDivElement>(null);
  const explorerCtxMenuRef = useRef<HTMLDivElement>(null);

  // Activity Bar state
  const [activePanel, setActivePanel] = useState<SidebarPanel>('explorer');
  const [gitChangeCount, setGitChangeCount] = useState(0);

  useSettings();
  useFolderWatcher();
  useDiscordRpc();
  useNavigation();
  useKeyboardShortcuts({ setSettingsOpen });
  useEditorBridge();

  // Poll git change count for activity bar badge
  useEffect(() => {
    if (!currentFolderPath || !window.api) { setGitChangeCount(0); return; }
    const poll = async () => {
      const res = await window.api.gitStatus(currentFolderPath);
      if (res.success) {
        setGitChangeCount((res.staged?.length ?? 0) + (res.unstaged?.length ?? 0) + (res.untracked?.length ?? 0));
      } else {
        setGitChangeCount(0);
      }
    };
    poll();
    const timer = setInterval(poll, 5000);
    return () => clearInterval(timer);
  }, [currentFolderPath]);

  // Suppress Monaco's internal CancellationToken rejections.
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const r = event.reason;
      if (!r) return;
      if (r instanceof Error && r.name === 'Canceled') { event.preventDefault(); return; }
      if (typeof r === 'object' && !(r instanceof Error) && !r.stack) { event.preventDefault(); }
    };
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  // Close context menus when clicking outside
  useEffect(() => {
    if (!tabCtxMenu && !explorerCtxMenu) return;
    const handler = (e: MouseEvent) => {
      if (tabCtxMenu && tabCtxMenuRef.current && !tabCtxMenuRef.current.contains(e.target as Node)) setTabCtxMenu(null);
      if (explorerCtxMenu && explorerCtxMenuRef.current && !explorerCtxMenuRef.current.contains(e.target as Node)) setExplorerCtxMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tabCtxMenu, explorerCtxMenu]);

  const isResizing = useRef(false);
  const onResizerDown = () => { isResizing.current = true; };
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const w = e.clientX - 40; // account for activity bar
      if (w > 150 && w < 600) setSidebarWidth(w);
    };
    const onUp = () => { isResizing.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const handleActivityClick = (panel: SidebarPanel) => {
    setActivePanel(panel);
  };

  return (
    <>
      <TitleBar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenServer={() => setServerOpen(true)}
        onOpenConfig={() => setConfigOpen(true)}
      />

      <div className="main-layout">
        {/* Activity Bar */}
        <div className="activity-bar">
          {/* Explorer */}
          <button
            className={`activity-bar-item${activePanel === 'explorer' ? ' active' : ''}`}
            title="Explorer"
            onClick={() => handleActivityClick('explorer')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          {/* Source Control */}
          <button
            className={`activity-bar-item${activePanel === 'sourceControl' ? ' active' : ''}`}
            title="Source Control"
            onClick={() => handleActivityClick('sourceControl')}
            style={{ position: 'relative' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
              <line x1="12" y1="12" x2="12" y2="15" />
            </svg>
            {gitChangeCount > 0 && (
              <span className="activity-bar-badge">{gitChangeCount > 99 ? '99+' : gitChangeCount}</span>
            )}
          </button>
        </div>

        {/* Sidebar (Explorer or Source Control) */}
        {(activePanel === 'explorer' ? currentFolderPath !== null : true) && (
          <>
            <Sidebar
              width={sidebarWidth}
              onExplorerContextMenu={(x: number, y: number, path: string, isDirectory: boolean) =>
                setExplorerCtxMenu({ x, y, path, isDirectory })
              }
              activePanel={activePanel}
            />
            <div className="resizer" onMouseDown={onResizerDown} />
          </>
        )}

        <div className="editor-area">
          <TabsBar onTabContextMenu={(x: number, y: number, tabId: number) => setTabCtxMenu({ x, y, tabId })} />
          <Toolbar
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenServer={() => setServerOpen(true)}
            onOpenConfig={() => setConfigOpen(true)}
          />
          <div className="editor-container" style={{ position: 'relative' }}>
            {/*
              CRITICAL: EditorPanel must ALWAYS be mounted.
              If we conditionally unmount it (when activeTabId is null), Monaco's
              editor gets destroyed. On remount, editorRef.current holds the old
              destroyed editor. Our useEffect fires BEFORE handleEditorDidMount
              (Monaco init is async), so editor.setModel() is called on a dead
              editor object → client-side crash.
              Solution: Keep EditorPanel always mounted. Show WelcomeScreen as
              an absolute overlay on top when no tab is open.
            */}
            <EditorPanel />
            {activeTabId === null && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column' }}>
                <WelcomeScreen />
              </div>
            )}
          </div>
        </div>
      </div>

      <OutputPanel />
      <StatusBar
        onEncodingClick={() => setEncodingPickerOpen(true)}
      />

      { }
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {serverOpen && <ServerModal onClose={() => setServerOpen(false)} />}
      {configOpen && <ConfigModal onClose={() => setConfigOpen(false)} />}
      {encodingPickerOpen && <EncodingPicker onClose={() => setEncodingPickerOpen(false)} />}

      {tabCtxMenu && (
        <div ref={tabCtxMenuRef}>
          <TabContextMenu
            x={tabCtxMenu.x}
            y={tabCtxMenu.y}
            tabId={tabCtxMenu.tabId}
            onClose={() => setTabCtxMenu(null)}
          />
        </div>
      )}
      {explorerCtxMenu && (
        <div ref={explorerCtxMenuRef}>
          <ExplorerContextMenu
            x={explorerCtxMenu.x}
            y={explorerCtxMenu.y}
            itemPath={explorerCtxMenu.path}
            isDirectory={explorerCtxMenu.isDirectory}
            onClose={() => setExplorerCtxMenu(null)}
          />
        </div>
      )}
    </>
  );
}
