'use client';

import { useEditorContext } from '@/context/EditorContext';

interface TabsBarProps {
    onTabContextMenu: (x: number, y: number, tabId: number) => void;
}

export default function TabsBar({ onTabContextMenu }: TabsBarProps) {
    const { tabs, activeTabId, setActiveTabId, closeTab } = useEditorContext();

    return (
        <div className="tabs-bar">
            <div className="tabs-list">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
                        onClick={(e) => {
                            const closeid = (e.target as HTMLElement).closest('[data-closeid]');
                            if (closeid) {
                                closeTab(parseInt(closeid.getAttribute('data-closeid')!));
                                return;
                            }
                            setActiveTabId(tab.id);
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            onTabContextMenu(e.clientX, e.clientY, tab.id);
                        }}
                    >
                        <svg className="tab-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="tab-name" title={tab.path ?? tab.name}>{tab.name}</span>
                        {tab.dirty && <span className="tab-dirty">●</span>}
                        <span className="tab-close" data-closeid={tab.id}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" /><line x1="8.5" y1="1.5" x2="1.5" y2="8.5" />
                            </svg>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
