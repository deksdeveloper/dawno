'use client';

import { useEffect } from 'react';
import { useEditorContext } from '../context/EditorContext';

export function useSettings() {
    const { setSettings } = useEditorContext();

    useEffect(() => {
        if (!window.api) return;

        window.api.getSettings().then(s => {
            if (s) setSettings(prev => ({ ...prev, ...s }));
        });
    }, [setSettings]);
}
