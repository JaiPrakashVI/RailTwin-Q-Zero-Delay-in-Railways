import React, { useState, useEffect } from 'react';
import { Settings, Cpu, Zap, Save } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const [executionMode, setExecutionMode] = useState('AerSimulator');
  const [pLayers, setPLayers] = useState(2);
  const [shots, setShots] = useState(1024);
  const [optimizer, setOptimizer] = useState('COBYLA');
  const [warmStart, setWarmStart] = useState(true);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.execution_mode) setExecutionMode(data.execution_mode);
          if (data.qaoa_p_layers) setPLayers(data.qaoa_p_layers);
          if (data.shots) setShots(data.shots);
          if (data.optimizer) setOptimizer(data.optimizer);
          if (data.warm_start != null) setWarmStart(data.warm_start);
        }
      })
      .catch((err) => console.warn('Could not fetch settings API:', err));
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          execution_mode: executionMode,
          qaoa_p_layers: pLayers,
          shots: shots,
          optimizer: optimizer,
          warm_start: warmStart
        })
      });
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch (err) {
      console.warn('Save settings error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card-panel glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={24} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>System & Quantum Engine Configuration</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Configure Qiskit QAOA execution, simulator backends, and telemetry parameters</div>
          </div>
        </div>

        <button className="btn-quantum" onClick={handleSave} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
          <Save size={16} /> {savedStatus ? 'SAVED TO BACKEND!' : 'Save Configuration'}
        </button>
      </div>

      {/* Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Quantum Execution Backend */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 className="card-title"><Cpu size={18} className="icon" /> Quantum Hardware / Simulator Mode</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            <label style={{ color: '#cbd5e1' }}>Execution Mode:</label>
            <select
              value={executionMode}
              onChange={(e) => setExecutionMode(e.target.value)}
              style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
            >
              <option value="AerSimulator">Qiskit AerSimulator (High Speed)</option>
              <option value="IBM_Quantum_Runtime">IBM Quantum Runtime (Physical QPU)</option>
              <option value="Statevector">Exact Statevector Simulator</option>
            </select>

            <label style={{ color: '#cbd5e1', marginTop: '10px' }}>QAOA Layer Depth (p):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={pLayers}
              onChange={(e) => setPLayers(parseInt(e.target.value))}
              style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
            />
          </div>
        </div>

        {/* Optimizer & Warm Start */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 className="card-title"><Zap size={18} className="icon" /> Classical Optimizer & Warm Start</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            <label style={{ color: '#cbd5e1' }}>Classical Optimizer Class:</label>
            <select
              value={optimizer}
              onChange={(e) => setOptimizer(e.target.value)}
              style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
            >
              <option value="COBYLA">COBYLA (Constrained Optimization By Linear Approximation)</option>
              <option value="SPSA">SPSA (Simultaneous Perturbation Stochastic Approximation)</option>
              <option value="SLSQP">SLSQP (Sequential Least Squares Programming)</option>
            </select>

            <label style={{ color: '#cbd5e1', marginTop: '10px' }}>Shots per Circuit Evaluation:</label>
            <input
              type="number"
              step="512"
              value={shots}
              onChange={(e) => setShots(parseInt(e.target.value))}
              style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                checked={warmStart}
                onChange={(e) => setWarmStart(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <span style={{ color: '#ffffff' }}>Enable Relaxed-LP Warm-Start Initialization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
