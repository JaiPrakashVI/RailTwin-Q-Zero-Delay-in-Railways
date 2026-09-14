import React from 'react';
import { X, Train } from 'lucide-react';

interface TrainTelemetryModalProps {
  train: any;
  onClose: () => void;
}

export const TrainTelemetryModal: React.FC<TrainTelemetryModalProps> = ({ train, onClose }) => {
  if (!train) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Train size={20} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Train Telemetry: {train.train_no || 12640}</h3>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{train.name || 'Express'} ({train.train_type || 'EXPRESS'})</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.82rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>SPEED & PROGRESS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {train.speed || 45} km/h <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>({train.progress || 0}%)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>CURRENT DELAY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: (train.delay || 0) > 10 ? '#f87171' : '#34d399', fontFamily: 'var(--font-mono)' }}>
              {train.delay || 0} mins
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#94a3b8', fontWeight: 700 }}>AI Delay Projections</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>+15 mins horizon:</span>
            <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{train.predicted_delay_15 || train.delay || 0}m</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>+30 mins horizon:</span>
            <strong style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{train.predicted_delay_30 || train.delay || 0}m</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>+60 mins horizon:</span>
            <strong style={{ color: '#f87171', fontFamily: 'var(--font-mono)' }}>{train.predicted_delay_60 || train.delay || 0}m</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
