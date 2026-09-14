import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2 } from 'lucide-react';

export const WhatIfTab: React.FC = () => {
  const [scenariosData, setScenariosData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/whatif')
      .then((res) => res.json())
      .then((data) => {
        if (data) setScenariosData(data);
      })
      .catch((err) => console.warn('Could not fetch whatif API:', err));
  }, []);

  const defaultScenarios = [
    { key: 'Scenario A (No Action)', name: 'No Action (Baseline)', delay: 52, congestion: 85, recovery: 45, saved: 0, color: '#ef4444' },
    { key: 'Scenario B (Platform Swap)', name: 'Platform Swap', delay: 31, congestion: 65, recovery: 28, saved: 3200, color: '#f97316' },
    { key: 'Scenario C (Speed Adjustment)', name: 'Speed Adjustment', delay: 20, congestion: 52, recovery: 22, saved: 5400, color: '#3b82f6' },
    { key: 'Scenario D (Reroute)', name: 'Reroute via Jolarpettai', delay: 18, congestion: 48, recovery: 18, saved: 7100, color: '#f59e0b' },
    { key: 'Scenario E (Hold Train)', name: 'Quantum Optimized (Best)', delay: 12, congestion: 38, recovery: 12, saved: 9720, color: '#10b981' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card-panel glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={24} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>What-If Scenario Counterfactual Simulator</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Side-by-side comparative simulation across 5 operational intervention bundles</div>
          </div>
        </div>

        <span className="badge badge-green" style={{ padding: '6px 12px' }}>
          <CheckCircle2 size={14} /> 5 Counterfactuals Evaluated
        </span>
      </div>

      {/* 5 Scenario Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        {defaultScenarios.map((sc, idx) => {
          const raw = scenariosData?.[sc.key];
          const delayVal = raw?.total_delay != null ? Math.round(raw.total_delay / 10) : sc.delay;
          const isBest = idx === defaultScenarios.length - 1;

          return (
            <div
              key={idx}
              className="card-panel"
              style={{
                borderColor: isBest ? '#10b981' : 'rgba(255,255,255,0.08)',
                background: isBest ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div>
                <span className={`badge ${isBest ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                  {isBest ? 'BEST SOLUTION' : `SCENARIO ${String.fromCharCode(65 + idx)}`}
                </span>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>{sc.name}</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Delay:</span>
                  <strong style={{ color: sc.color, fontFamily: 'var(--font-mono)' }}>{delayVal} min</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Congestion:</span>
                  <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{sc.congestion}%</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Recovery:</span>
                  <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{sc.recovery} min</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Pass Saved:</span>
                  <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{sc.saved.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
