import React, { useState, useEffect } from 'react';
import { Bell, Check, Search } from 'lucide-react';

export const AlertsTab: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        const triggers = data?.triggers || [];
        const gates = data?.decision_gates || [];
        const combined = [
          ...triggers.map((t: any, idx: number) => ({ id: idx, type: 'TRIGGER', text: t.text || t.reason || t.trigger, tick: t.tick || 50, severity: 'HIGH' })),
          ...gates.map((g: any, idx: number) => ({ id: idx + 100, type: 'DECISION_GATE', text: g.text || g.reason || g.decision, tick: g.tick || 50, severity: 'CRITICAL' })),
        ];
        setAlerts(combined);
      })
      .catch((err) => console.warn('Could not fetch alerts API:', err));
  }, []);

  const handleAcknowledge = (id: number) => {
    if (!acknowledgedIds.includes(id)) {
      setAcknowledgedIds((prev) => [...prev, id]);
    }
  };

  const defaultAlerts = [
    { id: 1, type: 'INCIDENT', text: 'Signal Failure detected at Katpadi Junction (Track TRK_02)', tick: 50, severity: 'CRITICAL' },
    { id: 2, type: 'TRIGGER', text: 'Trigger Engine: Delay threshold > 15m exceeded on Chennai Sector', tick: 48, severity: 'HIGH' },
    { id: 3, type: 'GATE', text: 'Decision Gate: QAOA Optimizer recommended reroute with 94% confidence', tick: 52, severity: 'MEDIUM' },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;
  const filteredAlerts = displayAlerts.filter((a) => String(a.text).toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card-panel glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={24} color="#ef4444" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>System Alarm & Trigger Audit Log</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time events from Trigger Engine and Decision Gate logs</div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 12px 6px 32px',
              fontSize: '0.8rem',
              color: '#ffffff',
              outline: 'none',
              width: '220px'
            }}
          />
        </div>
      </div>

      {/* Alerts Table */}
      <div className="card-panel">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                <th style={{ padding: '10px' }}>Tick</th>
                <th style={{ padding: '10px' }}>Type</th>
                <th style={{ padding: '10px' }}>Severity</th>
                <th style={{ padding: '10px' }}>Description / Log Message</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((a: any) => {
                const isAck = acknowledgedIds.includes(a.id);
                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: isAck ? '#64748b' : '#ffffff' }}>
                    <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>t={a.tick}</td>
                    <td style={{ padding: '10px' }}>
                      <span className="badge badge-blue">{a.type}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge ${a.severity === 'CRITICAL' ? 'badge-red' : 'badge-yellow'}`}>{a.severity}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span dangerouslySetInnerHTML={{ __html: a.text }} />
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => handleAcknowledge(a.id)}
                        className={isAck ? 'btn-accept' : 'btn-quantum'}
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        disabled={isAck}
                      >
                        {isAck ? <Check size={12} /> : null} {isAck ? 'ACKNOWLEDGED' : 'Acknowledge'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
