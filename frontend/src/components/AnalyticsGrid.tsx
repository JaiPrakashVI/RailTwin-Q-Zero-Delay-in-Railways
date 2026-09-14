import React from 'react';
import { Compass, GitFork, Users, ArrowRight, CloudRain, AlertTriangle, Cpu, CheckCircle2, Play } from 'lucide-react';

interface AnalyticsGridProps {
  acceptedActionsCount: number;
  passImpact: any;
  optResult: any;
  propGraph: any;
  currentTickData: any;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({
  acceptedActionsCount: _count,
  passImpact,
  optResult: _optResult,
  propGraph: _propGraph,
  currentTickData
}) => {
  const counterfactualScenarios = [
    { name: 'No Action (Baseline)', delay: 52, color: '#ef4444', isBest: false },
    { name: 'Platform Swap', delay: 31, savings: '-21 min', color: '#f97316', isBest: false },
    { name: 'Reroute via Jolarpettai', delay: 18, savings: '-34 min', color: '#f59e0b', isBest: false },
    { name: 'Speed Adjustment', delay: 20, savings: '-32 min', color: '#3b82f6', isBest: false },
    { name: 'Quantum Optimized (Best)', delay: 12, savings: '-40 min', color: '#10b981', isBest: true },
  ];

  const timelineEvents = [
    { time: '08:15 AM', label: 'Heavy Rain Alert', sub: 'Chennai Region', icon: CloudRain, color: '#38bdf8' },
    { time: '09:25 AM', label: 'Signal Failure', sub: 'Katpadi Junction', icon: AlertTriangle, color: '#f87171' },
    { time: '09:30 AM', label: 'Delay Propagation', sub: '12 Trains Affected', icon: GitFork, color: '#f59e0b' },
    { time: '09:42 AM', label: 'AI Analysis Complete', sub: 'Recommendations Ready', icon: CheckCircle2, color: '#10b981' },
    { time: '09:43 AM', label: 'Quantum Optimization', sub: 'Finding Best Solution', icon: Cpu, color: '#a78bfa' },
    { time: '09:45 AM', label: 'Action Execution', sub: 'In Progress', icon: Play, color: '#38bdf8' },
  ];

  const passengersDelayedStr = passImpact?.total_impacted_passengers != null
    ? passImpact.total_impacted_passengers.toLocaleString()
    : (currentTickData?.impact?.passengers_delayed != null
        ? currentTickData.impact.passengers_delayed.toLocaleString()
        : 'N/A');

  const passengersSavedStr = passImpact?.passengers_saved != null
    ? passImpact.passengers_saved.toLocaleString()
    : (currentTickData?.impact?.passengers_saved != null
        ? currentTickData.impact.passengers_saved.toLocaleString()
        : 'N/A');

  const connectionsProtectedStr = passImpact?.connections_protected != null
    ? passImpact.connections_protected.toLocaleString()
    : '18';

  const stationsImpactedStr = passImpact?.stations_impacted != null
    ? passImpact.stations_impacted.toLocaleString()
    : '5';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 4 Bottom Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* 1. Counterfactual Scenarios */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              <Compass size={16} className="icon" /> Counterfactual Scenarios
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {counterfactualScenarios.map((sc, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ color: sc.isBest ? '#34d399' : '#cbd5e1', fontWeight: sc.isBest ? 700 : 500 }}>
                    {sc.name}
                  </span>
                  <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {sc.delay} min {sc.savings && <strong style={{ color: '#34d399', marginLeft: '4px' }}>↓ {sc.savings.replace('-', '')}</strong>}
                  </span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(sc.delay / 52) * 100}%`,
                      background: sc.color,
                      height: '100%',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Pareto Optimal Frontier */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              <GitFork size={16} className="icon" /> Pareto Optimal Frontier
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>View All</span>
          </div>

          <div style={{ position: 'relative', height: '160px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '10px' }}>
            <svg width="100%" height="100%" viewBox="0 0 200 130">
              {/* Grid Lines */}
              <line x1="20" y1="10" x2="20" y2="110" stroke="rgba(255,255,255,0.1)" />
              <line x1="20" y1="110" x2="190" y2="110" stroke="rgba(255,255,255,0.1)" />
              
              {/* Axes Labels */}
              <text x="25" y="20" fill="#64748b" fontSize="8">Risk / Cost (High)</text>
              <text x="130" y="125" fill="#64748b" fontSize="8">Delay Savings →</text>

              {/* Suboptimal Solution Points */}
              <circle cx="50" cy="30" r="3" fill="#3b82f6" opacity="0.6" />
              <circle cx="70" cy="50" r="3" fill="#3b82f6" opacity="0.6" />
              <circle cx="85" cy="80" r="3" fill="#3b82f6" opacity="0.6" />
              <circle cx="110" cy="70" r="3" fill="#3b82f6" opacity="0.6" />

              {/* Pareto Frontier Line & Points */}
              <path d="M 50,30 L 70,50 L 95,75 L 140,85" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="50" cy="30" r="4" fill="#10b981" />
              <circle cx="70" cy="50" r="4" fill="#10b981" />
              <circle cx="95" cy="75" r="4" fill="#10b981" />
              
              {/* Optimal Selected Point */}
              <circle cx="140" cy="85" r="7" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
              <circle cx="140" cy="85" r="3" fill="#10b981" />
              
              <text x="110" y="78" fill="#34d399" fontSize="8" fontWeight="700">Optimal Solution</text>
            </svg>
          </div>
        </div>

        {/* 3. Top Candidate Actions Overview */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              Top Candidate Actions
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#34d399' }}>REROUTE</strong>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Chennai Mall (12640)</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ color: '#ffffff' }}>18 min</strong>
                <div style={{ color: '#34d399', fontSize: '0.68rem' }}>94% Conf</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#38bdf8' }}>PLATFORM SWAP</strong>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Katpadi Junction</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ color: '#ffffff' }}>12 min</strong>
                <div style={{ color: '#38bdf8', fontSize: '0.68rem' }}>89% Conf</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#f59e0b' }}>SPEED ADJUSTMENT</strong>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Select Trains</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ color: '#ffffff' }}>8 min</strong>
                <div style={{ color: '#f59e0b', fontSize: '0.68rem' }}>83% Conf</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Passenger Impact */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              <Users size={16} className="icon" /> Passenger Impact
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Passengers Delayed</span>
              <strong style={{ color: '#f87171', fontFamily: 'var(--font-mono)' }}>{passengersDelayedStr}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Passengers Saved (Best Action)</span>
              <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{passengersSavedStr}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Connections Protected</span>
              <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{connectionsProtectedStr}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Stations Impacted</span>
              <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{stationsImpactedStr}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Event Timeline Footer */}
      <div className="card-panel" style={{ padding: '14px 20px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
          Event Timeline Flow
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {timelineEvents.map((ev, idx) => {
            const Icon = ev.icon;
            return (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${ev.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={16} color={ev.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{ev.time}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>{ev.label}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{ev.sub}</div>
                  </div>
                </div>

                {idx < timelineEvents.length - 1 && (
                  <ArrowRight size={16} color="rgba(255,255,255,0.2)" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
