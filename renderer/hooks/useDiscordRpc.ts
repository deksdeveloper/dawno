'use client';

import { useEffect, useRef } from 'react';
import { useEditorContext } from '../context/EditorContext';

export function useDiscordRpc() {
    const { tabs, activeTabId, currentFolderPath, settings } = useEditorContext();
    const lastUpdateRef = useRef<string>('');

    // Derive active tab details explicitly for dependency tracking
    const activeTab = tabs.find(t => t.id === activeTabId);
    const activeTabName = activeTab?.name ?? null;
    const activeTabPath = activeTab?.path ?? null;

    useEffect(() => {
        if (typeof window === 'undefined' || !window.api) return;

        const enabled = settings.discordRPC !== false;
        if (!enabled) {
            window.api.toggleRPC(false);
            return;
        }

        window.api.toggleRPC(true);

        const folderName = currentFolderPath
            ? currentFolderPath.split(/[\\\/]/).pop() || currentFolderPath
            : null;

        let details: string;
        let state: string;

        if (activeTabName) {
            details = `Editing: ${activeTabName}`;
            state = folderName ? `in ${folderName}` : 'DAWNO Editor';
        } else if (folderName) {
            details = 'DAWNO Editor';
            state = `Browsing: ${folderName}`;
        } else {
            details = 'DAWNO Editor';
            state = 'Idle';
        }

        const updateKey = `${details}|${state}`;
        if (updateKey === lastUpdateRef.current) return;
        lastUpdateRef.current = updateKey;

        window.api.updateRPC({
            details,
            state,
            largeImageKey: 'logo',
            largeImageText: 'DAWNO Editor',
            instance: false,
        });
    }, [activeTabId, activeTabName, activeTabPath, currentFolderPath, settings.discordRPC]);
}
