import React, { useState } from 'react';
import { AlertTriangle, X, Check, ShieldAlert, FileText } from 'lucide-react';

interface OperatorOverrideModalProps {
  isOpen: boolean;
  actionId: string | null;
  actionTitle?: string;
  trainName?: string;
  onClose: () => void;
  onConfirmReject: (actionId: string, reason: string, notes: string) => void;
}

const PREDEFINED_REASONS = [
  { id: 'MAINTENANCE', label: '🛠️ Unscheduled Track Maintenance', color: '#f59e0b' },
  { id: 'WEATHER', label: '🌧️ Severe Weather / Low Visibility', color: '#3b82f6' },
  { id: 'VIP_PRIORITY', label: '👑 VIP / Express Train Priority Override', color: '#a855f7' },
  { id: 'OVERCROWDING', label: '👥 Station Platform Overcrowding Hazard', color: '#ef4444' },
  { id: 'SIGNAL_FAULT', label: '🚦 Interlocking / Signal Point Defect', color: '#10b981' }
];

export const OperatorOverrideModal: React.FC<OperatorOverrideModalProps> = ({
  isOpen,
  actionId,
  actionTitle,
  trainName,
  onClose,
  onConfirmReject
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('MAINTENANCE');
  const [customNotes, setCustomNotes] = useState<string>('');

  if (!isOpen || !actionId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonLabel = PREDEFINED_REASONS.find(r => r.id === selectedReason)?.label || selectedReason;
    onConfirmReject(actionId, reasonLabel, customNotes);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.15)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(239, 68, 68, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={18} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>
                Operator Override & Action Rejection
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Action ID: <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{actionId}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Action Details Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '12px 14px'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Target Recommendation
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
              {actionTitle || 'AI Candidate Dispatch Recommendation'}
            </div>
            {trainName && (
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Affected Train: <span style={{ color: '#fbbf24', fontWeight: 600 }}>{trainName}</span>
              </div>
            )}
          </div>

          {/* Reason Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              Select Operational Overriding Reason <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PREDEFINED_REASONS.map((r) => {
                const isSelected = selectedReason === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReason(r.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: isSelected ? '#ffffff' : '#cbd5e1', fontWeight: isSelected ? 600 : 400 }}>
                      {r.label}
                    </span>
                    {isSelected && <Check size={14} color="#ef4444" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              <FileText size={14} color="#94a3b8" /> Additional Controller Field Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Enter site-specific observations or physical constraints..."
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '10px',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Safety Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.72rem',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '8px 12px',
              borderRadius: '6px',
              borderLeft: '3px solid #38bdf8'
            }}
          >
            <ShieldAlert size={16} color="#38bdf8" />
            Rejection reason will be logged to immutable audit records & AI feedback training loop.
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <AlertTriangle size={14} /> Confirm & Log Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
