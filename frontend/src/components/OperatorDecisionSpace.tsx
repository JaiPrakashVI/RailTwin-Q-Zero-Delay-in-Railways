import React, { useState } from 'react';
import { Sliders, Check, X, ShieldCheck, Eye, Activity, Users, Clock, Zap } from 'lucide-react';
import { OperatorOverrideModal } from './OperatorOverrideModal';

interface CandidateAction {
  id: string;
  type: string;
  trainId: number;
  trainName: string;
  title: string;
  delayReductionMin: number;
  confidencePct: number;
  passengersImpacted: number;
  riskCost: number;
  status: 'RECOMMENDED' | 'ACCEPTED' | 'REJECTED' | 'CANDIDATE';
}

interface OperatorDecisionSpaceProps {
  acceptedActions: string[];
  rejectedActions: string[];
  onAcceptAction: (actionId: string) => void;
  onRejectAction: (actionId: string, reason?: string, notes?: string) => void;
}

export const OperatorDecisionSpace: React.FC<OperatorDecisionSpaceProps> = ({
  acceptedActions,
  rejectedActions,
  onAcceptAction,
  onRejectAction
}) => {
  const [rejectingAction, setRejectingAction] = useState<CandidateAction | null>(null);
  const [previewingAction, setPreviewingAction] = useState<CandidateAction | null>(null);

  const initialActions: CandidateAction[] = [
    {
      id: 'ACT_01',
      type: 'REROUTE',
      trainId: 12640,
      trainName: 'Chennai Express',
      title: 'REROUTE via Alternate Path Track 2',
      delayReductionMin: 18,
      confidencePct: 94,
      passengersImpacted: 4320,
      riskCost: 0.12,
      status: 'RECOMMENDED'
    },
    {
      id: 'ACT_02',
      type: 'PLATFORM_SWAP',
      trainId: 12608,
      trainName: 'Lalbagh Express',
      title: 'PLATFORM SWAP Katpadi Junction Platform 3',
      delayReductionMin: 12,
      confidencePct: 89,
      passengersImpacted: 2100,
      riskCost: 0.18,
      status: 'CANDIDATE'
    },
    {
      id: 'ACT_03',
      type: 'SPEED_ADJUSTMENT',
      trainId: 12007,
      trainName: 'Shatabdi Express',
      title: 'SPEED ADJUSTMENT +15 km/h on Arakkonam Sector',
      delayReductionMin: 8,
      confidencePct: 83,
      passengersImpacted: 1450,
      riskCost: 0.25,
      status: 'CANDIDATE'
    },
    {
      id: 'ACT_04',
      type: 'HOLD_TRAIN',
      trainId: 16057,
      trainName: 'Sapthagiri Express',
      title: 'HOLD TRAIN at Arakkonam Platform 2 for 4 mins',
      delayReductionMin: 6,
      confidencePct: 78,
      passengersImpacted: 890,
      riskCost: 0.31,
      status: 'CANDIDATE'
    }
  ];

  // Calculate dynamic cumulative impact of accepted decisions
  const acceptedList = initialActions.filter(a => acceptedActions.includes(a.id));
  const totalDelaySaved = acceptedList.reduce((sum, a) => sum + a.delayReductionMin, 0);
  const totalPassengersProtected = acceptedList.reduce((sum, a) => sum + a.passengersImpacted, 0);
  const expectedRecoveryMin = acceptedList.length > 0 ? Math.max(12, 32 - totalDelaySaved) : 32;

  const getStatusBadge = (id: string, defaultStatus: string) => {
    if (acceptedActions.includes(id)) {
      return <span className="badge badge-green"><Check size={12} /> ACCEPTED</span>;
    }
    if (rejectedActions.includes(id)) {
      return <span className="badge badge-red"><X size={12} /> REJECTED</span>;
    }
    if (defaultStatus === 'RECOMMENDED') {
      return <span className="badge badge-purple">QUANTUM RECOMMENDED</span>;
    }
    return <span className="badge badge-blue">CANDIDATE</span>;
  };

  const handleConfirmReject = (actionId: string, reason: string, notes: string) => {
    onRejectAction(actionId, reason, notes);
    setRejectingAction(null);
  };

  return (
    <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sliders size={18} color="#10b981" />
          </div>
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>Top Candidate Quantum Actions</h3>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Manual Operator Decision Control Panel & HITL Impact Verification
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} /> Quantum Verified Safety Constraints
        </div>
      </div>

      {/* Real-time Verified Network Impact Summary Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Delay Saved</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              -{totalDelaySaved} min
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={16} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Passengers Protected</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {totalPassengersProtected.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={16} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>System Recovery Window</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a855f7', fontFamily: 'var(--font-mono)' }}>
              {expectedRecoveryMin} m <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>(vs 32m baseline)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Approved Actions</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {acceptedActions.length} / {initialActions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Actions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {initialActions.map((act) => {
          const isAccepted = acceptedActions.includes(act.id);
          const isRejected = rejectedActions.includes(act.id);

          return (
            <div
              key={act.id}
              style={{
                background: isAccepted
                  ? 'rgba(16, 185, 129, 0.08)'
                  : isRejected
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${
                  isAccepted
                    ? 'rgba(16, 185, 129, 0.3)'
                    : isRejected
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(255, 255, 255, 0.08)'
                }`,
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Action Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: '#38bdf8',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {act.type.slice(0, 3)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                      {act.title}
                    </span>
                    {getStatusBadge(act.id, act.status)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                    Train {act.trainId} ({act.trainName}) | Risk Index: {act.riskCost}
                  </div>
                </div>
              </div>

              {/* Metrics Breakdown & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Delay Savings</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                    -{act.delayReductionMin} min
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Confidence</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {act.confidencePct}%
                  </div>
                </div>

                {/* Preview Outcome Trigger */}
                <button
                  onClick={() => setPreviewingAction(act)}
                  title="Preview outcome details"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={13} color="#38bdf8" /> Preview
                </button>

                {/* Accept / Reject Operator Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn-accept"
                    onClick={() => onAcceptAction(act.id)}
                    disabled={isAccepted}
                    style={{ opacity: isAccepted ? 0.6 : 1, cursor: isAccepted ? 'not-allowed' : 'pointer' }}
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => setRejectingAction(act)}
                    disabled={isRejected}
                    style={{ opacity: isRejected ? 0.6 : 1, cursor: isRejected ? 'not-allowed' : 'pointer' }}
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operator Rejection Override Reason Modal */}
      <OperatorOverrideModal
        isOpen={!!rejectingAction}
        actionId={rejectingAction?.id || null}
        actionTitle={rejectingAction?.title}
        trainName={rejectingAction?.trainName}
        onClose={() => setRejectingAction(null)}
        onConfirmReject={handleConfirmReject}
      />

      {/* Action Outcome Preview Modal */}
      {previewingAction && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '14px',
              padding: '20px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1rem' }}>Outcome Projections: {previewingAction.id}</h4>
              <button onClick={() => setPreviewingAction(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '10px' }}>
              {previewingAction.title}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>DELAY SAVINGS</span>
                <strong style={{ color: '#34d399', fontSize: '1rem' }}>-{previewingAction.delayReductionMin} mins</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>CONFIDENCE BOUNDS</span>
                <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>{previewingAction.confidencePct}% [95% CI]</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>PASSENGERS SAVED</span>
                <strong style={{ color: '#fbbf24', fontSize: '1rem' }}>{previewingAction.passengersImpacted.toLocaleString()}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>RISK COST INDEX</span>
                <strong style={{ color: previewingAction.riskCost < 0.2 ? '#34d399' : '#f87171', fontSize: '1rem' }}>{previewingAction.riskCost}</strong>
              </div>
            </div>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button
                onClick={() => setPreviewingAction(null)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
