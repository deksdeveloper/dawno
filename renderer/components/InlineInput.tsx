'use client';

import React, { useEffect, useRef, useState } from 'react';

interface InlineInputProps {
    defaultValue?: string;
    placeholder?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export default function InlineInput({ defaultValue = '', placeholder = '', onConfirm, onCancel }: InlineInputProps) {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onCancel();
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [onCancel]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = value?.trim();
            if (trimmed) onConfirm(trimmed);
            else onCancel();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)',
            }}
        >
            <div style={{
                background: 'var(--bg-secondary, #161b22)',
                border: '1px solid var(--border-color, #30363d)',
                borderRadius: '8px',
                padding: '16px 20px',
                minWidth: '280px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
                <input
                    ref={inputRef}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        background: 'var(--bg-primary, #0d1117)',
                        border: '1px solid var(--border-color, #30363d)',
                        borderRadius: '4px',
                        color: 'var(--text-primary, #e6edf3)',
                        fontSize: '13px',
                        padding: '6px 10px',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color, #30363d)',
                            borderRadius: '4px',
                            color: 'var(--text-secondary, #8b949e)',
                            padding: '4px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >Cancel</button>
                    <button
                        onClick={() => { const t = value?.trim(); if (t) onConfirm(t); else onCancel(); }}
                        style={{
                            background: 'var(--accent-color, #1f6feb)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            padding: '4px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >OK</button>
                </div>
                <div style={{ color: 'var(--text-secondary, #8b949e)', fontSize: '11px', marginTop: '6px' }}>
                    Press Enter to confirm, Escape to cancel
                </div>
            </div>
        </div>
    );
}
