import React from 'react';
import { X, Network } from 'lucide-react';

interface StationTelemetryModalProps {
  station: any;
  onClose: () => void;
}

export const StationTelemetryModal: React.FC<StationTelemetryModalProps> = ({ station, onClose }) => {
  if (!station) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Station Node Telemetry: {station.name || 'Katpadi Junction'}</h3>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Station Code: {station.code || 'KPD'} | Type: {station.isJunction ? 'Junction Hub' : 'Regular'}</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.82rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>PLATFORM OCCUPANCY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {station.platforms || '5/6'} Occupied
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>STATUS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: station.status === 'Severe' ? '#f87171' : '#34d399', fontFamily: 'var(--font-mono)' }}>
              {station.status || 'Normal'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
