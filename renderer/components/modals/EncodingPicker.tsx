'use client';

import { useEditorContext } from '@/context/EditorContext';
import { useState } from 'react';

const ENCODINGS = [
    { label: 'UTF-8', value: 'utf-8', desc: 'Unicode (Universal)' },
    { label: 'Windows-1254', value: 'windows-1254', desc: 'Turkish' },
    { label: 'Windows-1252', value: 'windows-1252', desc: 'Western European' },
    { label: 'Windows-1251', value: 'windows-1251', desc: 'Cyrillic' },
    { label: 'Windows-1250', value: 'windows-1250', desc: 'Central European' },
    { label: 'Windows-1253', value: 'windows-1253', desc: 'Greek' },
    { label: 'Windows-1255', value: 'windows-1255', desc: 'Hebrew' },
    { label: 'Windows-1256', value: 'windows-1256', desc: 'Arabic' },
    { label: 'Windows-1257', value: 'windows-1257', desc: 'Baltic' },
    { label: 'Windows-1258', value: 'windows-1258', desc: 'Vietnamese' },
    { label: 'ISO-8859-1', value: 'iso-8859-1', desc: 'Western' },
    { label: 'ISO-8859-2', value: 'iso-8859-2', desc: 'Central European' },
    { label: 'ISO-8859-3', value: 'iso-8859-3', desc: 'South European' },
    { label: 'ISO-8859-4', value: 'iso-8859-4', desc: 'North European' },
    { label: 'ISO-8859-9', value: 'iso-8859-9', desc: 'Turkish' },
    { label: 'IBM850', value: 'ibm850', desc: 'DOS Western' },
    { label: 'IBM852', value: 'ibm852', desc: 'DOS Central European' },
    { label: 'UTF-16LE', value: 'utf-16le', desc: 'Unicode (Little Endian)' },
    { label: 'UTF-16BE', value: 'utf-16be', desc: 'Unicode (Big Endian)' },
];

export default function EncodingPicker({ onClose }: { onClose: () => void }) {
    const { currentEncoding, setCurrentEncoding, appendOutput } = useEditorContext();
    const [search, setSearch] = useState('');

    const filtered = ENCODINGS.filter(e =>
        e.label.toLowerCase().includes(search.toLowerCase()) ||
        e.desc.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (enc: string) => {
        setCurrentEncoding(enc);
        appendOutput(`Encoding set to ${enc.toUpperCase()}`, 'info');
        onClose();
    };

    return (
        <div className="quick-pick-overlay" onClick={onClose}>
            <div className="quick-pick" onClick={e => e.stopPropagation()}>
                <div className="quick-pick-header">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Select File Encoding..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Escape') onClose();
                            if (e.key === 'Enter' && filtered.length > 0) handleSelect(filtered[0].value);
                        }}
                    />
                </div>
                <div className="quick-pick-list">
                    {filtered.map(enc => (
                        <div
                            key={enc.value}
                            className={`quick-pick-item ${currentEncoding === enc.value ? 'active' : ''}`}
                            onClick={() => handleSelect(enc.value)}
                        >
                            <span className="quick-pick-label">{enc.label}</span>
                            <span className="quick-pick-desc">{enc.desc}</span>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="quick-pick-item" style={{ cursor: 'default' }}>No results found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
