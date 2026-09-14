import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

interface AlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/alerts')
        .then((res) => res.json())
        .then((data) => {
          const triggers = data?.triggers || [];
          const gates = data?.decision_gates || [];
          setAlerts([...triggers.slice(0, 5), ...gates.slice(0, 5)]);
        })
        .catch((err) => console.warn('Could not fetch alerts drawer API:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={onClose}>
      <div
        style={{
          width: '380px',
          height: '100vh',
          background: '#121929',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="#ef4444" />
            <h3 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>System Alarm Drawer</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
          {(alerts.length > 0 ? alerts : [
            { text: 'Signal Failure at Katpadi Junction detected at 09:25 AM', tick: 50, type: 'CRITICAL' },
            { text: 'Trigger Engine: Delay threshold > 15m on Chennai Express', tick: 48, type: 'HIGH' },
            { text: 'Decision Gate Verdict: REROUTE Action Recommended', tick: 52, type: 'GATE' }
          ]).map((a: any, idx: number) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.68rem' }}>
                <span>TICK {a.tick || 50}</span>
                <span className="badge badge-red">{a.type || 'ALARM'}</span>
              </div>
              <div style={{ color: '#ffffff' }} dangerouslySetInnerHTML={{ __html: a.text }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
