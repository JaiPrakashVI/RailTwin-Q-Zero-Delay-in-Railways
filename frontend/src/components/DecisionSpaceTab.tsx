import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Layers, Award } from 'lucide-react';

export const DecisionSpaceTab: React.FC = () => {
  const [paretoData, setParetoData] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [isRecomputing, setIsRecomputing] = useState<boolean>(false);
  
  // Objective Weight Sliders State
  const [delayWeight, setDelayWeight] = useState<number>(0.4);
  const [riskWeight, setRiskWeight] = useState<number>(0.3);
  const [costWeight, setCostWeight] = useState<number>(0.2);
  const [congWeight, setCongWeight] = useState<number>(0.1);

  useEffect(() => {
    fetch('/api/decision-space')
      .then((res) => res.json())
      .then((data) => {
        if (data?.pareto_front) {
          setParetoData(data.pareto_front);
          if (data.pareto_front.pareto_solutions?.length > 0) {
            setSelectedPoint(data.pareto_front.pareto_solutions[0]);
          }
        }
      })
      .catch((err) => console.warn('Could not fetch decision space API:', err));
  }, []);

  const handleRecompute = async () => {
    setIsRecomputing(true);
    try {
      const res = await fetch('/api/decision-space/recompute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delay_weight: delayWeight,
          risk_weight: riskWeight,
          cost_weight: costWeight,
          congestion_weight: congWeight
        })
      });
      const updated = await res.json();
      if (updated?.pareto_solutions) {
        setParetoData((prev: any) => ({
          ...prev,
          pareto_solutions: updated.pareto_solutions
        }));
      }
    } catch (err) {
      console.warn('Recompute error:', err);
    } finally {
      setIsRecomputing(false);
    }
  };

  // Debounced auto-recompute on weight slider changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRecompute();
    }, 400);
    return () => clearTimeout(timer);
  }, [delayWeight, riskWeight, costWeight, congWeight]);

  const solutions = paretoData?.pareto_solutions || [
    { solution_id: 'SOL_01', delay_reduction: 40, risk_cost: 0.12, cost: 120, non_dominated: true, user_score: 92.4 },
    { solution_id: 'SOL_02', delay_reduction: 34, risk_cost: 0.18, cost: 95, non_dominated: true, user_score: 85.1 },
    { solution_id: 'SOL_03', delay_reduction: 21, risk_cost: 0.25, cost: 60, non_dominated: true, user_score: 74.0 },
    { solution_id: 'SOL_04', delay_reduction: 12, risk_cost: 0.35, cost: 40, non_dominated: false, user_score: 58.2 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card-panel glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sliders size={24} color="#10b981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Decision Space & Multi-Objective Pareto Frontier</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Dynamic trade-off analysis balancing delay reduction, risk cost, and operational complexity</div>
          </div>
        </div>

        <button
          className="btn-quantum"
          onClick={handleRecompute}
          disabled={isRecomputing}
          style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: isRecomputing ? 0.7 : 1 }}
        >
          <RefreshCw size={14} className={isRecomputing ? 'spin' : ''} /> {isRecomputing ? 'Recomputing...' : 'Recalculate Frontier'}
        </button>
      </div>

      {/* Main Grid: Pareto Plot + Sliders Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Pareto Frontier Scatter Plot */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Pareto Non-Dominated Solutions Plot</h3>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              Active Objective Weights: D:{delayWeight} | R:{riskWeight} | C:{costWeight}
            </span>
          </div>

          <div style={{ position: 'relative', height: '300px', background: 'rgba(0,0,0,0.25)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 260">
              <line x1="40" y1="20" x2="40" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="40" y1="220" x2="480" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

              <text x="50" y="35" fill="#64748b" fontSize="10">Risk / Cost Index (High)</text>
              <text x="360" y="245" fill="#64748b" fontSize="10">Delay Savings (mins) →</text>

              {/* Plot Solutions Points */}
              {solutions.map((s: any, idx: number) => {
                const cx = 40 + (s.delay_reduction || (idx + 1) * 8) * 9.5;
                const cy = 220 - (1 - (s.risk_cost || 0.2)) * 180;
                const isSelected = selectedPoint?.solution_id === s.solution_id;

                return (
                  <g key={idx} onClick={() => setSelectedPoint(s)} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '9' : '6'}
                      fill={s.non_dominated !== false ? '#10b981' : '#3b82f6'}
                      stroke={isSelected ? '#ffffff' : 'none'}
                      strokeWidth="2.5"
                    />
                    <text x={cx + 10} y={cy + 4} fill="#f8fafc" fontSize="9" fontWeight="600">
                      {s.solution_id || `SOL_${idx + 1}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Solution Details Card */}
          {selectedPoint && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} color="#38bdf8" /> Selected Pareto Candidate Solution: <strong style={{ color: '#ffffff' }}>{selectedPoint.solution_id}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  Delay Saved: <span style={{ color: '#34d399', fontWeight: 700 }}>-{selectedPoint.delay_reduction}m</span> | Risk Score: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{selectedPoint.risk_cost}</span>
                </div>
              </div>
              {selectedPoint.user_score !== undefined && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Weighted Score</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {selectedPoint.user_score} pts
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive Objective Weight Sliders */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Objective Weights Tuning</h3>
            <span style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={12} /> Dynamic Ranking
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>Delay Reduction Weight</span>
                <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{delayWeight}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={delayWeight}
                onChange={(e) => setDelayWeight(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>Risk Cost Weight</span>
                <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{riskWeight}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={riskWeight}
                onChange={(e) => setRiskWeight(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>Operational Cost Weight</span>
                <strong style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{costWeight}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={costWeight}
                onChange={(e) => setCostWeight(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>Congestion Weight</span>
                <strong style={{ color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>{congWeight}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={congWeight}
                onChange={(e) => setCongWeight(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
