import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface MapFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapFilterModal: React.FC<MapFilterModalProps> = ({ isOpen, onClose }) => {
  const [showNormal, setShowNormal] = useState(true);
  const [showModerate, setShowModerate] = useState(true);
  const [showCongested, setShowCongested] = useState(true);
  const [showSevere, setShowSevere] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>Map Filter Options</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
            <input type="checkbox" checked={showNormal} onChange={(e) => setShowNormal(e.target.checked)} style={{ accentColor: '#10b981' }} />
            Show Normal Status Tracks (Green)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
            <input type="checkbox" checked={showModerate} onChange={(e) => setShowModerate(e.target.checked)} style={{ accentColor: '#f59e0b' }} />
            Show Moderate Status Tracks (Yellow)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
            <input type="checkbox" checked={showCongested} onChange={(e) => setShowCongested(e.target.checked)} style={{ accentColor: '#f97316' }} />
            Show Congested Status Tracks (Orange)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
            <input type="checkbox" checked={showSevere} onChange={(e) => setShowSevere(e.target.checked)} style={{ accentColor: '#ef4444' }} />
            Show Severe Disruption Tracks (Red)
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button className="btn-quantum" onClick={onClose} style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            Apply Map Filters
          </button>
        </div>
      </div>
    </div>
  );
};
