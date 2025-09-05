import React, { useState } from 'react';
import { X, Plus, Trash2, Settings } from 'lucide-react';
import { 
  sensitiveConfig, 
  addSensitiveKeywords, 
  removeSensitiveKeywords,
  updateSensitiveConfig 
} from '../config/sensitiveConfig';

const SensitiveConfigModal = ({ isOpen, onClose }) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [config, setConfig] = useState({ ...sensitiveConfig });

  if (!isOpen) return null;

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addSensitiveKeywords(newKeyword.trim().toLowerCase());
      setConfig({ ...sensitiveConfig });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    removeSensitiveKeywords(keyword);
    setConfig({ ...sensitiveConfig });
  };

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateSensitiveConfig({ [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-5" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-card rounded-lg p-4 md:p-5 w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-xl border border-border flex flex-col relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-border">
          <h2 className="text-primary text-lg font-semibold flex items-center gap-2">
            <Settings size={20} style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
            Sensitive Content Configuration
          </h2>
          <button className="bg-transparent border-none cursor-pointer p-2 rounded text-foreground transition-colors hover:bg-accent" onClick={onClose}>
            <X size={20} style={{ width: '20px', height: '20px', color: 'var(--foreground)' }} />
          </button>
        </div>

        <div className="mb-6 pb-4 border-b border-border">
          <h3 className="mb-3 text-primary text-base">General Settings</h3>
          
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleConfigChange('enabled', e.target.checked)}
              />
              Enable sensitive content masking
            </label>
          </div>

          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={config.allowUnmask}
                onChange={(e) => handleConfigChange('allowUnmask', e.target.checked)}
              />
              Show unmask button in notes
            </label>
          </div>

          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={config.showPartial}
                onChange={(e) => handleConfigChange('showPartial', e.target.checked)}
              />
              Show partial content (first and last characters)
            </label>
          </div>

          <div className="mb-3">
            <label className="text-sm">
              Mask Character:
              <input
                type="text"
                maxLength="1"
                value={config.maskCharacter}
                onChange={(e) => handleConfigChange('maskCharacter', e.target.value)}
                className="px-2 py-1.5 border border-input rounded bg-background text-foreground text-sm ml-2"
                style={{ width: '40px', textAlign: 'center' }}
              />
            </label>
          </div>

          <div className="mb-3">
            <label className="text-sm">
              Mask Length:
              <input
                type="number"
                min="4"
                max="20"
                value={config.maskLength}
                onChange={(e) => handleConfigChange('maskLength', parseInt(e.target.value))}
                className="px-2 py-1.5 border border-input rounded bg-background text-foreground text-sm ml-2"
                style={{ width: '80px' }}
              />
            </label>
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-border">
          <h3 className="mb-3 text-primary text-base">Sensitive Keywords</h3>
          <p className="text-muted-foreground text-sm mb-3">
            Keywords that will trigger masking when followed by : or = or other separators
          </p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add new keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              className="px-2 py-1.5 border border-input rounded bg-background text-foreground text-sm flex-1"
            />
            <button onClick={handleAddKeyword} className="bg-primary text-primary-foreground border-none rounded px-2 py-1.5 cursor-pointer flex items-center justify-center">
              <Plus size={16} style={{ width: '16px', height: '16px', color: 'var(--primary-foreground)' }} />
            </button>
          </div>

          <div className="max-h-[200px] overflow-y-auto border border-input rounded p-2 bg-background">
            {config.sensitiveKeywords.map((keyword, index) => (
              <div key={index} className="flex justify-between items-center px-2 py-1 mb-1 bg-card rounded text-sm">
                <span>{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="bg-transparent border-none text-red-500 cursor-pointer p-0.5 rounded hover:bg-red-50"
                  title="Remove keyword"
                >
                  <Trash2 size={14} style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-border">
          <h3 className="mb-3 text-primary text-base">Supported Separators</h3>
          <div className="flex flex-wrap gap-2">
            {config.separators.map((separator, index) => (
              <span key={index} className="bg-background px-2 py-1 rounded text-xs font-mono border border-input">
                "{separator}"
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-border">
          <h3 className="mb-3 text-primary text-base">Examples</h3>
          <div className="bg-background p-3 rounded border border-input">
            <div className="font-mono text-xs mb-2 p-1">
              <strong className="text-primary">Original:</strong> password: mySecretPass123
            </div>
            <div className="font-mono text-xs mb-2 p-1">
              <strong className="text-primary">Masked:</strong> password: {config.maskCharacter.repeat(config.maskLength)}
            </div>
            <div className="font-mono text-xs mb-2 p-1">
              <strong className="text-primary">Original:</strong> api_key = sk-abc123def456
            </div>
            <div className="font-mono text-xs mb-2 p-1">
              <strong className="text-primary">Masked:</strong> api_key = {config.maskCharacter.repeat(config.maskLength)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button type="button" className="flex-1 px-4 py-2 bg-background text-foreground border border-input rounded cursor-pointer transition-colors hover:bg-accent" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SensitiveConfigModal;
