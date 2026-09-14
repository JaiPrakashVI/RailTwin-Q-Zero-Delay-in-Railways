import React from 'react';
import { Cpu, X, Zap, CheckCircle2 } from 'lucide-react';

interface QuantumVsClassicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySolution: () => void;
}

export const QuantumVsClassicalModal: React.FC<QuantumVsClassicalModalProps> = ({
  isOpen,
  onClose,
  onApplySolution
}) => {
  if (!isOpen) return null;

  const solvers = [
    {
      name: 'Qiskit QAOA (p=2, 24-Qubit)',
      tag: 'Quantum (Recommended)',
      isQuantum: true,
      executionTime: '1.24s',
      utilityScore: '94.2',
      violations: 0,
      recoveryTime: '12 min',
      color: '#06b6d4',
      badgeClass: 'badge-purple'
    },
    {
      name: 'Classical ILP / CBC',
      tag: 'Exact Classical',
      isQuantum: false,
      executionTime: '14.80s',
      utilityScore: '78.5',
      violations: 0,
      recoveryTime: '32 min',
      color: '#3b82f6',
      badgeClass: 'badge-blue'
    },
    {
      name: 'Simulated Annealing',
      tag: 'Meta-Heuristic',
      isQuantum: false,
      executionTime: '4.60s',
      utilityScore: '82.1',
      violations: 1,
      recoveryTime: '24 min',
      color: '#f59e0b',
      badgeClass: 'badge-yellow'
    },
    {
      name: 'Greedy Dispatcher',
      tag: 'Heuristic Baseline',
      isQuantum: false,
      executionTime: '0.18s',
      utilityScore: '64.0',
      violations: 2,
      recoveryTime: '45 min',
      color: '#ef4444',
      badgeClass: 'badge-red'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Cpu size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                Quantum vs Classical Solver Benchmark
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                QUBO Formulation & QAOA Expectation Value Optimization (Disruption Tick 50)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quantum Advantage Highlights Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Execution Speedup</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              11.94x
            </div>
            <div style={{ fontSize: '0.68rem', color: '#34d399' }}>vs Exact Classical ILP</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Utility Boost</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              +15.7 pts
            </div>
            <div style={{ fontSize: '0.68rem', color: '#34d399' }}>94.2 vs 78.5</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Recovery Reduction</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
              -20 min
            </div>
            <div style={{ fontSize: '0.68rem', color: '#34d399' }}>-62.5% faster clearing</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Constraint Violations</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              0 <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>violations</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#34d399' }}>100% Track & Dwell Safe</div>
          </div>
        </div>

        {/* 4 Solvers Side-by-Side Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {solvers.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: s.isQuantum ? 'rgba(6, 182, 212, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                border: `1px solid ${s.isQuantum ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative'
              }}
            >
              <div>
                <span className={`badge ${s.badgeClass}`} style={{ marginBottom: '6px' }}>{s.tag}</span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{s.name}</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Runtime:</span>
                  <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{s.executionTime}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Utility Score:</span>
                  <strong style={{ color: s.color, fontFamily: 'var(--font-mono)' }}>{s.utilityScore}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Recovery:</span>
                  <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{s.recoveryTime}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Violations:</span>
                  <strong style={{ color: s.violations === 0 ? '#34d399' : '#f87171', fontFamily: 'var(--font-mono)' }}>
                    {s.violations}
                  </strong>
                </div>
              </div>

              {s.isQuantum && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}>
                  <CheckCircle2 size={14} /> Optimal Solution Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Close Benchmark
          </button>
          <button
            onClick={() => {
              onApplySolution();
              onClose();
            }}
            className="btn-quantum"
            style={{ padding: '10px 24px' }}
          >
            <Zap size={18} />
            <span>Apply Quantum Solution to Operator Space</span>
          </button>
        </div>
      </div>
    </div>
  );
};
