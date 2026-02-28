'use client';

import { useEffect, useRef } from 'react';
import { useEditorContext } from '../context/EditorContext';

export function useDiscordRpc() {
    const { tabs, activeTabId, currentFolderPath, settings } = useEditorContext();
    const lastUpdateRef = useRef<string>('');

    useEffect(() => {
        if (typeof window === 'undefined' || !window.api) return;

        const enabled = settings.discordRPC !== false;
        if (!enabled) {
            window.api.toggleRPC(false);
            return;
        }

        window.api.toggleRPC(true);

        const activeTab = tabs.find(t => t.id === activeTabId);
        const folderName = currentFolderPath
            ? currentFolderPath.split(/[\\/]/).pop() || currentFolderPath
            : null;

        let details: string;
        let state: string;

        if (activeTab) {
            details = `Editing: ${activeTab.name}`;
            state = folderName ? `in ${folderName}` : 'DAWNO Editor';
        } else if (folderName) {
            details = `DAWNO Editor`;
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
    }, [activeTabId, tabs, currentFolderPath, settings.discordRPC]);
}
