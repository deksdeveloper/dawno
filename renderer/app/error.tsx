'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Always log the full error to the console so we can see it in DevTools
        console.error('[DAWNO Error Boundary] Caught error:', error);
        console.error('[DAWNO Error Boundary] Stack:', error.stack);
    }, [error]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0d1117',
            color: '#f85149',
            fontFamily: 'monospace',
            padding: '2rem',
            gap: '1rem'
        }}>
            <h2 style={{ color: '#f85149' }}>Application Error</h2>
            <pre style={{
                background: '#161b22',
                padding: '1rem',
                borderRadius: '8px',
                maxWidth: '80vw',
                overflow: 'auto',
                color: '#e6edf3',
                fontSize: '12px',
                border: '1px solid #30363d'
            }}>
                {error.message}
                {'\n\n'}
                {error.stack}
            </pre>
            <button
                onClick={reset}
                style={{
                    background: '#238636',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}
            >
                Try Again
            </button>
        </div>
    );
}
