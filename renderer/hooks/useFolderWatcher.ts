'use client';

import { useEffect } from 'react';
import { useEditorContext } from '@/context/EditorContext';

export function useFolderWatcher() {
    const { currentFolderPath, appendOutput } = useEditorContext();

    useEffect(() => {
        if (!window.api || !currentFolderPath) return;

        
        
        const unsubscribe = window.api.onFolderChange((data) => {
            console.log('Folder changed:', data);
        });

        return () => {
            
        };
    }, [currentFolderPath, appendOutput]);
}
