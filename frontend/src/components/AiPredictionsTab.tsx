import React, { useState, useEffect } from 'react';
import { TrendingUp, Search } from 'lucide-react';

interface AiPredictionsTabProps {
  currentTickData: any;
}

export const AiPredictionsTab: React.FC<AiPredictionsTabProps> = ({ currentTickData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/predictions')
      .then((res) => res.json())
      .then((data) => {
        if (data?.feature_importance) {
          setFeatureImportance(data.feature_importance);
        }
      })
      .catch((err) => console.warn('Could not fetch predictions API:', err));
  }, []);

  const trainsList = currentTickData?.trains || [
    { train_no: 12640, name: 'Chennai Express', status: 'MOVING', speed: 45, delay: 18, predicted_delay_15: 22, predicted_delay_30: 28, predicted_delay_60: 35, confidence: 0.94, top_factors: ['Signal Delay', 'Weather'] },
    { train_no: 12608, name: 'Lalbagh Express', status: 'WAITING', speed: 0, delay: 12, predicted_delay_15: 14, predicted_delay_30: 18, predicted_delay_60: 22, confidence: 0.89, top_factors: ['Platform Congestion'] },
    { train_no: 12007, name: 'Shatabdi Express', status: 'MOVING', speed: 85, delay: 0, predicted_delay_15: 0, predicted_delay_30: 2, predicted_delay_60: 5, confidence: 0.96, top_factors: ['Clear Corridor'] },
    { train_no: 16057, name: 'Sapthagiri Express', status: 'MOVING', speed: 30, delay: 6, predicted_delay_15: 9, predicted_delay_30: 12, predicted_delay_60: 16, confidence: 0.83, top_factors: ['Dwell Overrun'] },
  ];

  const filteredTrains = trainsList.filter(
    (t: any) =>
      String(t.train_no).includes(searchTerm) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const defaultFeatureImp = [
    { feature: 'Station Platform Occupancy', importance: 0.38 },
    { feature: 'Track Blockage Duration', importance: 0.26 },
    { feature: 'Downstream Queue Intensity', importance: 0.18 },
    { feature: 'Rain & Weather Impact', importance: 0.12 },
    { feature: 'Prior Train Dwell Excess', importance: 0.06 },
  ];

  const displayFeatImp = featureImportance.length > 0 ? featureImportance : defaultFeatureImp;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card-panel glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>AI Delay Projection & Feature Analytics</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time ML projections across +15m, +30m, and +60m horizons</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search train no / name..."
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
      </div>

      {/* Main Grid: Delay Table + Feature Importance */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '20px' }}>
        {/* Train Delay Table */}
        <div className="card-panel">
          <h3 className="card-title">Train Delay Predictions Horizon</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                  <th style={{ padding: '10px' }}>Train</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Current Delay</th>
                  <th style={{ padding: '10px' }}>+15 min</th>
                  <th style={{ padding: '10px' }}>+30 min</th>
                  <th style={{ padding: '10px' }}>+60 min</th>
                  <th style={{ padding: '10px' }}>Confidence</th>
                  <th style={{ padding: '10px' }}>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrains.map((t: any, idx: number) => {
                  const confPct = Math.round((t.confidence || 0.85) * 100);
                  const isHighRisk = (t.predicted_delay_30 || t.delay || 0) > 15;

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#ffffff' }}>
                      <td style={{ padding: '10px' }}>
                        <strong>{t.train_no}</strong>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{t.name}</div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span className={`badge ${t.status === 'MOVING' ? 'badge-green' : 'badge-yellow'}`}>{t.status}</span>
                      </td>
                      <td style={{ padding: '10px', color: (t.delay || 0) > 10 ? '#f87171' : '#34d399', fontFamily: 'var(--font-mono)' }}>
                        {t.delay || 0} min
                      </td>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>{t.predicted_delay_15 || t.delay || 0}m</td>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f59e0b' }}>
                        {t.predicted_delay_30 || t.delay || 0}m
                      </td>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>{t.predicted_delay_60 || t.delay || 0}m</td>
                      <td style={{ padding: '10px' }}>
                        <span className={`badge ${confPct > 85 ? 'badge-green' : 'badge-yellow'}`}>{confPct}%</span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span className={`badge ${isHighRisk ? 'badge-red' : 'badge-blue'}`}>{isHighRisk ? 'HIGH' : 'LOW'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Importance Panel */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 className="card-title">SHAP Feature Importance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayFeatImp.slice(0, 5).map((f: any, idx: number) => {
              const featName = f.feature || f.feature_name || `Feature ${idx + 1}`;
              const val = Math.abs(parseFloat(f.importance || f.shap_value || 0.2));

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1' }}>
                    <span>{featName}</span>
                    <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{(val * 100).toFixed(1)}%</strong>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '6px' }}>
                    <div style={{ width: `${Math.min(100, val * 100)}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', height: '100%', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
