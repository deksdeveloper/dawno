'use client';

import { useEditorContext } from '../../context/EditorContext';
import { useState } from 'react';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
    const { settings, setSettings, appendOutput } = useEditorContext();
    const [localSettings, setLocalSettings] = useState({ ...settings });

    const handleSave = async () => {
        const res = await window.api.saveSettings(localSettings);
        if (res) {
            setSettings(res);
            appendOutput('Settings saved successfully.', 'success');
            onClose();
        }
    };

    const browseFile = async (field: 'compilerPath') => {
        const path = await window.api.browseForFile({
            title: 'Select Compiler',
            filters: [{ name: 'Executables', extensions: ['exe'] }]
        });
        if (path) setLocalSettings(prev => ({ ...prev, [field]: path }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">Preferences</div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="settings-section">
                        <h3>Compiler</h3>
                        <div className="settings-row">
                            <label>Compiler Path (pawncc.exe)</label>
                            <div className="settings-file-row">
                                <input
                                    type="text"
                                    value={localSettings.compilerPath}
                                    onChange={e => setLocalSettings({ ...localSettings, compilerPath: e.target.value })}
                                    placeholder="C:\...\pawncc.exe"
                                />
                                <button className="btn-browse" onClick={() => browseFile('compilerPath')}>Browse</button>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>Editor</h3>
                        <div className="settings-row">
                            <label>Font Size</label>
                            <div className="settings-inline">
                                <input
                                    type="range"
                                    min="8"
                                    max="30"
                                    value={localSettings.fontSize}
                                    onChange={e => setLocalSettings({ ...localSettings, fontSize: parseInt(e.target.value) })}
                                />
                                <span id="font-size-label">{localSettings.fontSize}px</span>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>Integration</h3>
                        <div className="settings-row checkbox-row">
                            <input
                                id="rpc-check"
                                type="checkbox"
                                checked={localSettings.discordRPC}
                                onChange={e => {
                                    setLocalSettings({ ...localSettings, discordRPC: e.target.checked });
                                    window.api.toggleRPC(e.target.checked);
                                }}
                            />
                            <label htmlFor="rpc-check">Discord Rich Presence</label>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save-settings" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
