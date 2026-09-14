import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Minus, Compass, AlertTriangle, Radio } from 'lucide-react';

interface DigitalTwinMapProps {
  currentTickData: any;
  onSelectTrain?: (train: any) => void;
  onSelectStation?: (station: any) => void;
  onOpenFilters?: () => void;
  acceptedActions: string[];
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  currentTickData,
  onSelectTrain,
  onSelectStation,
  onOpenFilters,
  acceptedActions
}) => {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [hoveredEntity, setHoveredEntity] = useState<any>(null);

  // Network station topology nodes
  const stations = [
    { id: 1, name: 'Chennai', code: 'MAS', x: 580, y: 70, platforms: '8/10', status: 'Normal', isJunction: true },
    { id: 2, name: 'Arakkonam', code: 'AJJ', x: 450, y: 160, platforms: '4/6', status: 'Moderate', isJunction: true },
    { id: 3, name: 'Katpadi Junction', code: 'KPD', x: 390, y: 260, platforms: '5/6', status: 'Severe', isJunction: true, hasIncident: true },
    { id: 4, name: 'Jolarpettai', code: 'JTJ', x: 290, y: 340, platforms: '3/5', status: 'Normal', isJunction: true },
    { id: 5, name: 'Vaniyambadi', code: 'VN', x: 350, y: 380, platforms: '2/3', status: 'Moderate', isJunction: false },
    { id: 6, name: 'Tirupattur', code: 'TPT', x: 310, y: 440, platforms: '2/3', status: 'Normal', isJunction: false },
    { id: 7, name: 'Erode', code: 'ED', x: 250, y: 470, platforms: '4/5', status: 'Normal', isJunction: true },
    { id: 8, name: 'Vilupuram', code: 'VM', x: 520, y: 380, platforms: '3/4', status: 'Congested', isJunction: true },
    { id: 9, name: 'Tiruchirappalli', code: 'TPJ', x: 550, y: 480, platforms: '5/6', status: 'Normal', isJunction: true },
  ];

  // Track connections between stations
  const tracks = [
    { id: 1, from: 1, to: 2, status: 'Normal', color: '#10b981' },
    { id: 2, from: 2, to: 3, status: acceptedActions.length > 0 ? 'Moderate' : 'Severe', color: acceptedActions.length > 0 ? '#f59e0b' : '#ef4444' },
    { id: 3, from: 3, to: 4, status: 'Congested', color: '#f97316' },
    { id: 4, from: 3, to: 5, status: 'Moderate', color: '#f59e0b' },
    { id: 5, from: 5, to: 6, status: 'Normal', color: '#10b981' },
    { id: 6, from: 6, to: 7, status: 'Normal', color: '#10b981' },
    { id: 7, from: 1, to: 8, status: 'Congested', color: '#f97316' },
    { id: 8, from: 8, to: 9, status: 'Normal', color: '#10b981' },
    { id: 9, from: 3, to: 8, status: 'Congested', color: '#f97316' },
  ];

  // Dynamic trains extracted from tick or mock positions with Track Interpolation
  const rawTrainsList = currentTickData?.trains || [
    { train_no: 12640, name: 'Chennai Express', speed: 45, delay: 18, current_station_id: 2, current_track_id: 2, progress: 45 },
    { train_no: 12608, name: 'Lalbagh Express', speed: 60, delay: 12, current_station_id: 3, current_track_id: 3, progress: 65 },
    { train_no: 12007, name: 'Shatabdi Express', speed: 85, delay: 0, current_station_id: 1, current_track_id: 1, progress: 20 },
    { train_no: 16057, name: 'Sapthagiri Express', speed: 30, delay: 6, current_station_id: 3, current_track_id: 4, progress: 50 },
    { train_no: 12639, name: 'Brindavan Express', speed: 50, delay: 15, current_station_id: 3, current_track_id: 9, progress: 80 },
  ];

  // Compute exact (x, y) coordinates via dynamic 2D track vector interpolation
  const interpolatedTrains = rawTrainsList.map((tr: any, idx: number) => {
    let trX = 350;
    let trY = 200;

    const trackObj = tracks.find((t) => t.id === tr.current_track_id) || tracks[idx % tracks.length];
    if (trackObj) {
      const sFrom = stations.find((s) => s.id === trackObj.from);
      const sTo = stations.find((s) => s.id === trackObj.to);
      if (sFrom && sTo) {
        const p = Math.min(1.0, Math.max(0.0, (tr.progress || 50) / 100.0));
        trX = sFrom.x + p * (sTo.x - sFrom.x);
        trY = sFrom.y + p * (sTo.y - sFrom.y);
      }
    }

    return { ...tr, x: trX, y: trY };
  });

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.5, Math.max(0.7, prev + delta)));
  };

  return (
    <div className="card-panel glow-blue" style={{ position: 'relative', overflow: 'hidden', height: '440px', display: 'flex', flexDirection: 'column' }}>
      {/* Top Map Header & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="#06b6d4" className="pulse-indicator green" />
          <h3 className="card-title" style={{ margin: 0 }}>Live Digital Twin Map</h3>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Normal
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Moderate
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }} /> Congested
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Severe
            </span>
          </div>

          <button
            onClick={() => onOpenFilters && onOpenFilters()}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <SlidersHorizontal size={12} /> Filters
          </button>
        </div>
      </div>

      {/* SVG Canvas Railway Map */}
      <div style={{ flex: 1, position: 'relative', background: '#0a0f1d', borderRadius: '8px', overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 700 520"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <defs>
            <radialGradient id="incident-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Render Tracks */}
          {tracks.map((t) => {
            const sFrom = stations.find((s) => s.id === t.from);
            const sTo = stations.find((s) => s.id === t.to);
            if (!sFrom || !sTo) return null;
            return (
              <g key={t.id}>
                <line x1={sFrom.x} y1={sFrom.y} x2={sTo.x} y2={sTo.y} stroke={t.color} strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
                <line x1={sFrom.x} y1={sFrom.y} x2={sTo.x} y2={sTo.y} stroke={t.color} strokeWidth="3" strokeDasharray={t.status === 'Severe' ? '6,4' : 'none'} strokeLinecap="round" />
              </g>
            );
          })}

          {/* Active Incident Pulsating Beacon */}
          <circle cx="390" cy="260" r="32" fill="url(#incident-glow)">
            <animate attributeName="r" values="24;36;24" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="390" cy="260" r="14" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="2" />

          {/* Render Stations */}
          {stations.map((st) => (
            <g
              key={st.id}
              onClick={() => onSelectStation && onSelectStation(st)}
              onMouseEnter={() => setHoveredEntity({ type: 'station', data: st })}
              onMouseLeave={() => setHoveredEntity(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={st.x} cy={st.y} r={st.isJunction ? '8' : '5'} fill={st.hasIncident ? '#ef4444' : (st.status === 'Moderate' ? '#f59e0b' : '#10b981')} stroke="#090d16" strokeWidth="2.5" />
              <text x={st.x + 12} y={st.y + 4} fill="#f1f5f9" fontSize="11" fontWeight={st.isJunction ? '700' : '500'} fontFamily="var(--font-sans)">
                {st.name}
              </text>
            </g>
          ))}

          {/* Render Moving Interpolated Trains */}
          {interpolatedTrains.map((tr: any, idx: number) => (
            <g
              key={tr.train_no || idx}
              onClick={() => onSelectTrain && onSelectTrain(tr)}
              onMouseEnter={() => setHoveredEntity({ type: 'train', data: tr })}
              onMouseLeave={() => setHoveredEntity(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x={tr.x - 12} y={tr.y - 10} width="24" height="20" rx="4" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
              <text x={tr.x} y={tr.y + 4} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                {tr.train_no ? String(tr.train_no).slice(-3) : idx + 1}
              </text>
            </g>
          ))}
        </svg>

        {/* Incident Alert Badge Overlay */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(6px)', maxWidth: '300px' }}>
          <AlertTriangle size={20} color="#f87171" className="pulse-indicator red" />
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' }}>Active Incident</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Signal Failure at Katpadi Junction</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Detected at 09:25 AM | 12 Trains Affected</div>
          </div>
        </div>

        {/* Map Control Buttons */}
        <div style={{ position: 'absolute', right: '16px', bottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={() => handleZoom(0.1)} style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#131b2e', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={16} /></button>
          <button onClick={() => handleZoom(-0.1)} style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#131b2e', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={16} /></button>
          <button onClick={() => setZoomLevel(1.0)} style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#131b2e', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Reset Map View"><Compass size={16} /></button>
        </div>

        {/* Hover Entity Tooltip */}
        {hoveredEntity && (
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#090d16', border: '1px solid #3b82f6', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: '#ffffff', zIndex: 30, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            {hoveredEntity.type === 'station' ? (
              <div>
                <strong>Station: {hoveredEntity.data.name} ({hoveredEntity.data.code})</strong>
                <div>Platforms: {hoveredEntity.data.platforms}</div>
                <div>Status: <span style={{ color: hoveredEntity.data.status === 'Severe' ? '#ef4444' : '#10b981' }}>{hoveredEntity.data.status}</span></div>
              </div>
            ) : (
              <div>
                <strong>Train {hoveredEntity.data.train_no} - {hoveredEntity.data.name}</strong>
                <div>Speed: {hoveredEntity.data.speed || 45} km/h</div>
                <div>Delay: <span style={{ color: '#f87171' }}>{hoveredEntity.data.delay || 18} mins</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
