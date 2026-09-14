import React from 'react';
import { Cpu, ChevronRight, Zap } from 'lucide-react';

interface AiDecisionEngineProps {
  onRunQuantumOptimization: () => void;
  acceptedActionsCount: number;
  liveState: any;
  optResult: any;
  propGraph: any;
  passImpact: any;
  currentTickData: any;
}

export const AiDecisionEngine: React.FC<AiDecisionEngineProps> = ({
  onRunQuantumOptimization,
  acceptedActionsCount,
  liveState,
  optResult,
  propGraph: _propGraph,
  passImpact,
  currentTickData
}) => {
  const detectedIssue = liveState?.events?.[0]?.name || currentTickData?.events?.[0]?.name || 'Signal Failure at Katpadi Junction';
  
  const affectedTrainsCount = liveState?.trains
    ? liveState.trains.filter((t: any) => (t.delay || 0) > 0).length
    : (currentTickData?.trains
        ? currentTickData.trains.filter((t: any) => (t.delay || 0) > 0).length
        : 'N/A');

  const predictedDelay = liveState?.network_delay != null
    ? `${Math.round(liveState.network_delay)} min`
    : (currentTickData?.network_delay != null
        ? `${Math.round(currentTickData.network_delay)} min`
        : 'N/A');

  const passengersImpactedVal = passImpact?.total_impacted_passengers != null
    ? passImpact.total_impacted_passengers.toLocaleString()
    : (currentTickData?.impact?.passengers_delayed != null
        ? currentTickData.impact.passengers_delayed.toLocaleString()
        : 'N/A');

  const recommendedActionStr = acceptedActionsCount > 0
    ? 'ACTION APPLIED: REROUTE VIA TRACK 2'
    : (optResult?.selected_actions?.[0]?.action || 'REROUTE via Alternate Path');

  const confidenceScore = optResult?.circuit?.confidence != null
    ? Math.round(optResult.circuit.confidence * 100)
    : (acceptedActionsCount > 0 ? 98 : 94);

  return (
    <div className="card-panel glow-blue" style={{ display: 'flex', flexDirection: 'column', height: '440px', justifyContent: 'space-between' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Cpu size={18} color="#3b82f6" />
          </div>
          <h3 className="card-title" style={{ margin: 0 }}>AI Decision Engine</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500 }}>
          View Details <ChevronRight size={14} />
        </span>
      </div>

      {/* Telemetry Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <span style={{ color: '#94a3b8' }}>Detected Issue</span>
          <span style={{ color: '#f87171', fontWeight: 700, background: 'rgba(239, 68, 68, 0.15)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {detectedIssue}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <span style={{ color: '#94a3b8' }}>Affected Trains</span>
          <span style={{ color: '#ffffff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{affectedTrainsCount}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <span style={{ color: '#94a3b8' }}>Predicted Total Delay</span>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{predictedDelay}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <span style={{ color: '#94a3b8' }}>Passengers Impacted</span>
          <span style={{ color: '#ffffff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{passengersImpactedVal}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: '#94a3b8' }}>Recommended Action</span>
          <span style={{ color: '#34d399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {recommendedActionStr}
          </span>
        </div>
      </div>

      {/* Confidence Score Gauge Ring & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Confidence Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            {confidenceScore}%
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>QAOA QUBO Objective Optimization</div>
        </div>

        {/* SVG Radial Progress Ring */}
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              strokeDasharray="163.36"
              strokeDashoffset={163.36 * (1 - (typeof confidenceScore === 'number' ? confidenceScore : 90) / 100)}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#10b981' }}>
            <Zap size={18} />
          </div>
        </div>
      </div>

      {/* Primary Quantum Optimization Trigger Button */}
      <button className="btn-quantum" onClick={onRunQuantumOptimization} style={{ width: '100%' }}>
        <Cpu size={20} />
        <span>Run Quantum Optimization</span>
      </button>
    </div>
  );
};
