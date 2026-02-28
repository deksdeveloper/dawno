'use client';

import { useEffect } from 'react';
import { useEditorContext } from '../context/EditorContext';

export function useNavigation() {
    const { goBack, goForward } = useEditorContext();

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            // Button 3 is "Back", Button 4 is "Forward" on most mice
            // In JavaScript MouseEvent.button:
            // 0: Main (left)
            // 1: Auxiliary (middle)
            // 2: Secondary (right)
            // 3: Fourth button (Back)
            // 4: Fifth button (Forward)

            if (e.button === 3) {
                e.preventDefault();
                goBack();
            } else if (e.button === 4) {
                e.preventDefault();
                goForward();
            }
        };

        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [goBack, goForward]);
}
