import React from 'react';
import { CloudRain, Bell, Play, Pause, RotateCcw, Cpu, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentTick: number;
  simTimeStr: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onTickChange: (tick: number) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  activeScenario: string;
  onScenarioChange: (scenario: string) => void;
  onOpenAlerts?: () => void;
  onOpenDisruptionModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTick,
  simTimeStr,
  isPlaying,
  onTogglePlay,
  onReset,
  onTickChange,
  playbackSpeed,
  onSpeedChange,
  activeScenario,
  onScenarioChange,
  onOpenAlerts,
  onOpenDisruptionModal
}) => {
  return (
    <header className="header">
      {/* Title & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Cpu size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px' }}>
              RailTwin-Q
            </div>
            <div style={{ fontSize: '0.7rem', color: '#06b6d4', fontWeight: 600, letterSpacing: '0.5px' }}>
              AI + QUANTUM RAILWAY ROC
            </div>
          </div>
        </div>

        <div style={{ height: '24px', width: '1px', background: 'rgba(255, 255, 255, 0.12)', margin: '0 8px' }} />

        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Railway Network Operations Center
        </div>
      </div>

      {/* Simulation Playback Controller */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#131b2e',
          padding: '6px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <button
          onClick={onTogglePlay}
          style={{
            background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            border: `1px solid ${isPlaying ? '#ef4444' : '#10b981'}`,
            color: isPlaying ? '#ef4444' : '#10b981',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={onReset}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Reset Simulation"
        >
          <RotateCcw size={14} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '160px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span>TICK: <strong style={{ color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>{currentTick} / 120</strong></span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>{simTimeStr}</span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            value={currentTick}
            onChange={(e) => onTickChange(Number(e.target.value))}
            style={{ accentColor: '#06b6d4', cursor: 'pointer', height: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#090d16', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Speed:</span>
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              style={{
                background: playbackSpeed === s ? '#2563eb' : 'transparent',
                color: playbackSpeed === s ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls: Weather, Disruption Button, Alert Bell & Scenario Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Inject Custom Disruption Trigger Button */}
        <button
          onClick={() => onOpenDisruptionModal && onOpenDisruptionModal()}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={14} /> + Inject Disruption
        </button>

        {/* Weather Widget */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <CloudRain size={18} color="#38bdf8" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1 }}>24°C</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Heavy Rain</span>
          </div>
        </div>

        {/* Notifications */}
        <div
          onClick={() => onOpenAlerts && onOpenAlerts()}
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Bell size={18} color="#cbd5e1" />
          <div
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 6px #ef4444'
            }}
          />
        </div>

        {/* Scenario Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Scenario:</span>
          <select
            value={activeScenario}
            onChange={(e) => onScenarioChange(e.target.value)}
            style={{
              background: '#131b2e',
              color: '#f8fafc',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="Base Case">Base Case Disruption</option>
            <option value="Heavy Rain">Chennai Heavy Rain</option>
            <option value="Signal Failure">Katpadi Signal Failure</option>
            <option value="Peak Surge">High Density Peak Surge</option>
          </select>
        </div>
      </div>
    </header>
  );
};
