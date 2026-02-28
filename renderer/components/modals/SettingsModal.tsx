'use client';

import { useEditorContext } from '../../context/EditorContext';
import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LANGUAGE_NAMES, type Language } from '../../i18n/index';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
    const { settings, setSettings, appendOutput } = useEditorContext();
    const { t } = useLanguage();
    const [localSettings, setLocalSettings] = useState({ ...settings });

    const handleSave = async () => {
        const res = await window.api.saveSettings(localSettings);
        if (res) {
            setSettings(res);
            appendOutput(t.settingsModal.savedSuccess, 'success');
            onClose();
        }
    };

    const browseFile = async (field: 'compilerPath') => {
        const path = await window.api.browseForFile({
            title: t.settingsModal.selectCompiler,
            filters: [{ name: t.settingsModal.executables, extensions: ['exe'] }]
        });
        if (path) setLocalSettings(prev => ({ ...prev, [field]: path }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">{t.settingsModal.title}</div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="settings-section">
                        <h3>{t.settingsModal.compiler}</h3>
                        <div className="settings-row">
                            <label>{t.settingsModal.compilerPath}</label>
                            <div className="settings-file-row">
                                <input
                                    type="text"
                                    value={localSettings.compilerPath}
                                    onChange={e => setLocalSettings({ ...localSettings, compilerPath: e.target.value })}
                                    placeholder="C:\...\pawncc.exe"
                                />
                                <button className="btn-browse" onClick={() => browseFile('compilerPath')}>{t.settingsModal.browse}</button>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>{t.settingsModal.editor}</h3>
                        <div className="settings-row">
                            <label>{t.settingsModal.fontSize}</label>
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
                        <h3>{t.settingsModal.integration}</h3>
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
                            <label htmlFor="rpc-check">{t.settingsModal.discordRPC}</label>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>{t.settingsModal.language}</h3>
                        <div className="settings-row">
                            <select
                                value={localSettings.language ?? 'en'}
                                onChange={e => setLocalSettings({ ...localSettings, language: e.target.value })}
                                style={{
                                    background: 'var(--bg-input, #0d1117)',
                                    border: '1px solid var(--border-color, #30363d)',
                                    borderRadius: '4px',
                                    color: 'var(--text-primary, #e6edf3)',
                                    padding: '4px 8px',
                                    fontSize: '13px',
                                    width: '100%',
                                }}
                            >
                                {(Object.entries(LANGUAGE_NAMES) as [Language, string][]).map(([code, name]) => (
                                    <option key={code} value={code}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>{t.settingsModal.cancel}</button>
                    <button className="btn-save-settings" onClick={handleSave}>{t.settingsModal.saveChanges}</button>
                </div>
            </div>
        </div>
    );
}
