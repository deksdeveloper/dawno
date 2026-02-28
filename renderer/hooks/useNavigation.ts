'use client';

import { useEffect } from 'react';
import { useEditorContext } from '../context/EditorContext';

export function useNavigation() {
    const { goBack, goForward } = useEditorContext();

    useEffect(() => {
        // 1. Hardware-level "App Commands" (Windows/Electron best practice for mice)
        let unlistenBack: (() => void) | undefined;
        let unlistenForward: (() => void) | undefined;

        const api = window.api as any;

        if (api?.onNavBack) {
            unlistenBack = api.onNavBack(() => goBack());
        }
        if (api?.onNavForward) {
            unlistenForward = api.onNavForward(() => goForward());
        }

        // 2. Raw mouse button events (Fallback/Direct)
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 3) {
                e.preventDefault();
                goBack();
            } else if (e.button === 4) {
                e.preventDefault();
                goForward();
            }
        };

        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            if (unlistenBack) unlistenBack();
            if (unlistenForward) unlistenForward();
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [goBack, goForward]);
}
