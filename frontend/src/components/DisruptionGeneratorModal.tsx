import React, { useState } from 'react';
import { X, AlertTriangle, Cpu } from 'lucide-react';

interface DisruptionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisruptionInjected: () => void;
}

export const DisruptionGeneratorModal: React.FC<DisruptionGeneratorModalProps> = ({
  isOpen,
  onClose,
  onDisruptionInjected
}) => {
  const [disruptionType, setDisruptionType] = useState('Signal Failure');
  const [targetStation, setTargetStation] = useState('Katpadi Junction');
  const [intensity, setIntensity] = useState(1.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/disruption/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: disruptionType,
          station: targetStation,
          intensity: intensity
        })
      });
      setIsSubmitting(false);
      onDisruptionInjected();
      onClose();
    } catch (err) {
      console.warn('Disruption create error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="#f87171" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Inject Custom Disruption Scenario</h3>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Triggers live QAOA Quantum Solver re-optimization</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
          <div>
            <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Disruption Type:</label>
            <select
              value={disruptionType}
              onChange={(e) => setDisruptionType(e.target.value)}
              style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
            >
              <option value="Signal Failure">Signal Failure</option>
              <option value="Heavy Rain Alert">Heavy Rain Alert</option>
              <option value="Track Blockage">Track Blockage</option>
              <option value="Power Grid Failure">Power Grid Failure</option>
              <option value="Train Breakdown">Train Breakdown</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Target Sector / Station:</label>
            <select
              value={targetStation}
              onChange={(e) => setTargetStation(e.target.value)}
              style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
            >
              <option value="Katpadi Junction">Katpadi Junction (KPD)</option>
              <option value="Arakkonam Junction">Arakkonam Junction (AJJ)</option>
              <option value="Chennai Central">Chennai Central (MAS)</option>
              <option value="Jolarpettai">Jolarpettai (JTJ)</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Severity Intensity (0.5 - 2.0):</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="2.0"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" className="btn-quantum" disabled={isSubmitting}>
              <Cpu size={16} /> {isSubmitting ? 'Optimizing QAOA...' : 'Inject & Run QAOA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
