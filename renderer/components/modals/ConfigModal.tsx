'use client';

import { useEditorContext } from '@/context/EditorContext';
import { useState, useEffect } from 'react';

export default function ConfigModal({ onClose }: { onClose: () => void }) {
    const { currentFolderPath, appendOutput } = useEditorContext();
    const [configPath, setConfigPath] = useState('');
    const [configRows, setConfigRows] = useState<Array<{ key: string, value: string }>>([]);
    const [configType, setConfigType] = useState<'json' | 'cfg'>('json');

    const loadConfig = async (path: string) => {
        const res = await window.api.readConfigFile(path);
        if (res.success && res.data) {
            setConfigPath(path);
            setConfigType(res.type || 'json');
            const rows = Object.entries(res.data).map(([k, v]) => ({ key: k, value: String(v) }));
            setConfigRows(rows);
        } else if (res.error) {
            appendOutput(`Error loading config: ${res.error}`, 'error');
        }
    };

    useEffect(() => {
        
        if (!window.api) return;
        if (currentFolderPath) {
            window.api.detectConfig(currentFolderPath).then(path => {
                if (path) loadConfig(path);
            });
        }
    }, [currentFolderPath]);

    const handleSave = async () => {
        const data: Record<string, string> = {};
        configRows.forEach(row => { if (row.key) data[row.key] = row.value; });

        const res = await window.api.writeConfigFile(configPath, data, configType);
        if (res.success) {
            appendOutput('Config saved.', 'success');
            onClose();
        } else {
            appendOutput(`Save failed: ${res.error}`, 'error');
        }
    };

    const addRow = () => setConfigRows([...configRows, { key: '', value: '' }]);
    const removeRow = (i: number) => setConfigRows(configRows.filter((_, idx) => idx !== i));
    const updateRow = (i: number, field: 'key' | 'value', val: string) => {
        const next = [...configRows];
        next[i][field] = val;
        setConfigRows(next);
    };

    const browseConfig = async () => {
        const path = await window.api.browseForFile({
            title: 'Select Config File',
            filters: [{ name: 'Config Files', extensions: ['json', 'cfg'] }]
        });
        if (path) loadConfig(path);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal wide" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">Config Editor</div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body overflow-hidden">
                    <div className="config-path-row">
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>Configuration File</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-1)' }}>{configPath || 'None selected'}</div>
                        </div>
                        {configPath && <span className="config-type-badge">{configType}</span>}
                        <button className="btn-browse" onClick={browseConfig}>Browse</button>
                    </div>

                    <div className="config-table-wrapper">
                        <table className="config-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Key</th>
                                    <th>Value</th>
                                    <th style={{ width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {configRows.map((row, i) => (
                                    <tr key={i}>
                                        <td><input type="text" value={row.key} onChange={e => updateRow(i, 'key', e.target.value)} /></td>
                                        <td><input type="text" value={row.value} onChange={e => updateRow(i, 'value', e.target.value)} /></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="btn-remove-include" onClick={() => removeRow(i)}>&times;</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="btn-add-include" onClick={addRow}>+ Add Row</button>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save-settings" onClick={handleSave}>Save Config</button>
                </div>
            </div>
        </div>
    );
}
