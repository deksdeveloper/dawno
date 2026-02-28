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

  const showSidebar = currentFolderPath !== null;

  useSettings();
  useFolderWatcher();
  useDiscordRpc();
  useNavigation();
  useKeyboardShortcuts({ setSettingsOpen });
  useEditorBridge();

  // Close context menus when clicking outside
  useEffect(() => {
    if (!tabCtxMenu && !explorerCtxMenu) return;
    const handler = (e: MouseEvent) => {
      if (tabCtxMenu && tabCtxMenuRef.current && !tabCtxMenuRef.current.contains(e.target as Node)) {
        setTabCtxMenu(null);
      }
      if (explorerCtxMenu && explorerCtxMenuRef.current && !explorerCtxMenuRef.current.contains(e.target as Node)) {
        setExplorerCtxMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tabCtxMenu, explorerCtxMenu]);


  const isResizing = useRef(false);

  const onResizerDown = () => { isResizing.current = true; };
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const w = e.clientX;
      if (w > 150 && w < 600) setSidebarWidth(w);
    };
    const onUp = () => { isResizing.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <>
      <TitleBar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenServer={() => setServerOpen(true)}
        onOpenConfig={() => setConfigOpen(true)}
      />

      <div className="main-layout">
        {showSidebar && (
          <>
            <Sidebar
              width={sidebarWidth}
              onExplorerContextMenu={(x: number, y: number, path: string, isDirectory: boolean) =>
                setExplorerCtxMenu({ x, y, path, isDirectory })
              }
            />
            <div
              className="resizer"
              onMouseDown={onResizerDown}
            />
          </>
        )}

        <div className="editor-area">
          <TabsBar onTabContextMenu={(x: number, y: number, tabId: number) => setTabCtxMenu({ x, y, tabId })} />
          <Toolbar
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenServer={() => setServerOpen(true)}
            onOpenConfig={() => setConfigOpen(true)}
          />
          <div className="editor-container">
            {activeTabId === null ? (
              <WelcomeScreen />
            ) : (
              <EditorPanel />
            )}
          </div>
        </div>
      </div>

      <OutputPanel />
      <StatusBar onEncodingClick={() => setEncodingPickerOpen(true)} />

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
