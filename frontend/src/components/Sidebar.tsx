import React from 'react';
import {
  LayoutDashboard,
  Network,
  TrendingUp,
  GitFork,
  Sliders,
  Cpu,
  Compass,
  BarChart3,
  FileText,
  Bell,
  Settings,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  simTimeStr: string;
  isPlaying: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  simTimeStr,
  isPlaying
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Digital Twin', icon: Network },
    { id: 'ai-predictions', label: 'AI Predictions', icon: TrendingUp },
    { id: 'delay-propagation', label: 'Delay Propagation', icon: GitFork },
    { id: 'decision-space', label: 'Decision Space', icon: Sliders },
    { id: 'quantum-optimizer', label: 'Quantum Optimizer', icon: Cpu },
    { id: 'what-if', label: 'What-If Scenarios', icon: Compass },
    { id: 'results', label: 'Results & Impact', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const systemStatus = [
    { name: 'Data Ingestion', status: 'Operational' },
    { name: 'AI Models', status: 'Operational' },
    { name: 'Quantum Engine', status: 'Operational' },
    { name: 'Simulation Core', status: 'Operational' },
    { name: 'Digital Twin Sync', status: 'Operational' },
  ];

  return (
    <aside className="sidebar">
      {/* Navigation List */}
      <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <div style={{ padding: '0 8px 8px', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Operations Control
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: isActive ? 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
              }}
            >
              <Icon size={18} color={isActive ? '#ffffff' : '#64748b'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom System Status Widget */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
          <span>System Status</span>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> All Active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {systemStatus.map((sys, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-indicator green" style={{ width: '6px', height: '6px' }} />
                {sys.name}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.68rem' }}>{sys.status}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '8px',
            padding: '8px 10px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Simulation Time</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {simTimeStr}
            </div>
          </div>
          <div
            style={{
              padding: '3px 6px',
              borderRadius: '4px',
              background: isPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: isPlaying ? '#34d399' : '#fbbf24',
              fontSize: '0.65rem',
              fontWeight: 700
            }}
          >
            {isPlaying ? 'LIVE' : 'PAUSED'}
          </div>
        </div>
      </div>
    </aside>
  );
};
