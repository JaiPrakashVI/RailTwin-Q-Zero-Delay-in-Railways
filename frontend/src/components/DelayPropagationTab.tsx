import React, { useState, useEffect } from 'react';
import { GitFork, AlertTriangle, ArrowRight, Activity } from 'lucide-react';

export const DelayPropagationTab: React.FC = () => {
  const [cascadeEvents, setCascadeEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/propagation')
      .then((res) => res.json())
      .then((data) => {
        if (data?.cascade_events) {
          setCascadeEvents(data.cascade_events);
        }
      })
      .catch((err) => console.warn('Could not fetch propagation API:', err));
  }, []);

  const defaultCascadeNodes = [
    { id: 1, type: 'INCIDENT', title: 'Katpadi Signal Failure', sub: 'Root Event (09:25 AM)', color: '#ef4444' },
    { id: 2, type: 'TRAIN', title: 'Train 12640 (Chennai Exp)', sub: '+18 min delay', color: '#f97316' },
    { id: 3, type: 'TRAIN', title: 'Train 12608 (Lalbagh Exp)', sub: '+12 min delay', color: '#f59e0b' },
    { id: 4, type: 'STATION', title: 'Arakkonam Junction', sub: 'Queue Capacity 85%', color: '#38bdf8' },
    { id: 5, type: 'NETWORK', title: 'Downstream Corridor', sub: 'Cascade Impacted', color: '#8b5cf6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card-panel glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitFork size={24} color="#f97316" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Disruption Propagation & Cascade Tree</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Dynamic graph modeling of disruption spread across downstream tracks and trains</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-red" style={{ padding: '6px 12px' }}>
            <AlertTriangle size={14} /> Active Disruption Tree
          </span>
        </div>
      </div>

      {/* Network Cascade Flow Diagram */}
      <div className="card-panel">
        <h3 className="card-title">Downstream Delay Spread Flow</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {defaultCascadeNodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: `2px solid ${node.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={22} color={node.color} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{node.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{node.sub}</div>
              </div>

              {idx < defaultCascadeNodes.length - 1 && (
                <ArrowRight size={20} color="rgba(255,255,255,0.2)" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Cascade Log Table */}
      <div className="card-panel">
        <h3 className="card-title">Cascade Events Audit Trail</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                <th style={{ padding: '10px' }}>Tick / Time</th>
                <th style={{ padding: '10px' }}>Source Entity</th>
                <th style={{ padding: '10px' }}>Target Entity</th>
                <th style={{ padding: '10px' }}>Delay Impact</th>
                <th style={{ padding: '10px' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {(cascadeEvents.length > 0 ? cascadeEvents : [
                { tick: 50, source: 'Katpadi Junction', target: 'Train 12640', impact: '+18 min', severity: 'CRITICAL' },
                { tick: 52, source: 'Train 12640', target: 'Train 12608', impact: '+12 min', severity: 'HIGH' },
                { tick: 55, source: 'Train 12608', target: 'Arakkonam Junction', impact: '+8 min', severity: 'MEDIUM' },
              ]).map((e: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#ffffff' }}>
                  <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>t={e.tick || 50}</td>
                  <td style={{ padding: '10px', color: '#38bdf8' }}>{e.source || 'Katpadi'}</td>
                  <td style={{ padding: '10px', color: '#ffffff' }}>{e.target || 'Train'}</td>
                  <td style={{ padding: '10px', color: '#f87171', fontFamily: 'var(--font-mono)' }}>{e.impact || '+10 min'}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`badge ${e.severity === 'CRITICAL' ? 'badge-red' : 'badge-yellow'}`}>{e.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
