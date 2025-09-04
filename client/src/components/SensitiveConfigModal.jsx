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
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2><Settings size={20} style={{ marginRight: '8px' }} />Sensitive Content Configuration</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="config-section">
          <h3>General Settings</h3>
          
          <div className="config-option">
            <label className="config-checkbox">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleConfigChange('enabled', e.target.checked)}
              />
              Enable sensitive content masking
            </label>
          </div>

          <div className="config-option">
            <label className="config-checkbox">
              <input
                type="checkbox"
                checked={config.allowUnmask}
                onChange={(e) => handleConfigChange('allowUnmask', e.target.checked)}
              />
              Show unmask button in notes
            </label>
          </div>

          <div className="config-option">
            <label className="config-checkbox">
              <input
                type="checkbox"
                checked={config.showPartial}
                onChange={(e) => handleConfigChange('showPartial', e.target.checked)}
              />
              Show partial content (first and last characters)
            </label>
          </div>

          <div className="config-option">
            <label>
              Mask Character:
              <input
                type="text"
                maxLength="1"
                value={config.maskCharacter}
                onChange={(e) => handleConfigChange('maskCharacter', e.target.value)}
                className="config-input"
                style={{ width: '40px', textAlign: 'center' }}
              />
            </label>
          </div>

          <div className="config-option">
            <label>
              Mask Length:
              <input
                type="number"
                min="4"
                max="20"
                value={config.maskLength}
                onChange={(e) => handleConfigChange('maskLength', parseInt(e.target.value))}
                className="config-input"
                style={{ width: '80px' }}
              />
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Sensitive Keywords</h3>
          <p className="config-description">
            Keywords that will trigger masking when followed by : or = or other separators
          </p>
          
          <div className="keyword-add">
            <input
              type="text"
              placeholder="Add new keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              className="config-input"
              style={{ flex: 1 }}
            />
            <button onClick={handleAddKeyword} className="add-keyword-btn">
              <Plus size={16} />
            </button>
          </div>

          <div className="keywords-list">
            {config.sensitiveKeywords.map((keyword, index) => (
              <div key={index} className="keyword-item">
                <span>{keyword}</span>
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="remove-keyword-btn"
                  title="Remove keyword"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="config-section">
          <h3>Supported Separators</h3>
          <div className="separators-list">
            {config.separators.map((separator, index) => (
              <span key={index} className="separator-item">
                "{separator}"
              </span>
            ))}
          </div>
        </div>

        <div className="config-section">
          <h3>Examples</h3>
          <div className="examples">
            <div className="example-item">
              <strong>Original:</strong> password: mySecretPass123
            </div>
            <div className="example-item">
              <strong>Masked:</strong> password: {config.maskCharacter.repeat(config.maskLength)}
            </div>
            <div className="example-item">
              <strong>Original:</strong> api_key = sk-abc123def456
            </div>
            <div className="example-item">
              <strong>Masked:</strong> api_key = {config.maskCharacter.repeat(config.maskLength)}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SensitiveConfigModal;
