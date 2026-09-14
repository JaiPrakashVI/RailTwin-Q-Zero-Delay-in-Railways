import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KpiSummaryGrid } from './components/KpiSummaryGrid';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { AiDecisionEngine } from './components/AiDecisionEngine';
import { QuantumVsClassicalModal } from './components/QuantumVsClassicalModal';
import { OperatorDecisionSpace } from './components/OperatorDecisionSpace';
import { AnalyticsGrid } from './components/AnalyticsGrid';
import { QuantumOptimizerTab } from './components/QuantumOptimizerTab';

// 8 Additional Module Tabs
import { AiPredictionsTab } from './components/AiPredictionsTab';
import { DelayPropagationTab } from './components/DelayPropagationTab';
import { DecisionSpaceTab } from './components/DecisionSpaceTab';
import { WhatIfTab } from './components/WhatIfTab';
import { ResultsImpactTab } from './components/ResultsImpactTab';
import { ReportsTab } from './components/ReportsTab';
import { AlertsTab } from './components/AlertsTab';
import { SettingsTab } from './components/SettingsTab';

// Modals & Drawers
import { TrainTelemetryModal } from './components/TrainTelemetryModal';
import { StationTelemetryModal } from './components/StationTelemetryModal';
import { DisruptionGeneratorModal } from './components/DisruptionGeneratorModal';
import { AlertDrawer } from './components/AlertDrawer';
import { MapFilterModal } from './components/MapFilterModal';

export const App: React.FC = () => {
  const [currentTick, setCurrentTick] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeScenario, setActiveScenario] = useState<string>('Base Case');
  const [acceptedActions, setAcceptedActions] = useState<string[]>([]);
  const [rejectedActions, setRejectedActions] = useState<string[]>([]);

  // Modals & Drawers State
  const [isQuantumModalOpen, setIsQuantumModalOpen] = useState<boolean>(false);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState<boolean>(false);
  const [isDisruptionModalOpen, setIsDisruptionModalOpen] = useState<boolean>(false);
  const [isMapFilterOpen, setIsMapFilterOpen] = useState<boolean>(false);

  // Live Backend Models State
  const [simulationHistory, setSimulationHistory] = useState<any[]>([]);
  const [liveState, setLiveState] = useState<any>(null);
  const [optResult, setOptResult] = useState<any>(null);
  const [propGraph, setPropGraph] = useState<any>(null);
  const [passImpact, setPassImpact] = useState<any>(null);

  // Real-time Hydration & Polling Engine
  useEffect(() => {
    async function syncDashboardWithBackend() {
      try {
        const [ls, opt, prop, pass, hist] = await Promise.all([
          fetch('/datasets/live_state.json').then((res) => res.json()).catch(() => null),
          fetch('/datasets/optimization_result.json').then((res) => res.json()).catch(() => null),
          fetch('/datasets/propagation_graph.json').then((res) => res.json()).catch(() => null),
          fetch('/datasets/passenger_impact.json').then((res) => res.json()).catch(() => null),
          fetch('/datasets/simulation_history.json').then((res) => res.json()).catch(() => null)
        ]);

        if (ls) setLiveState(ls);
        if (opt) setOptResult(opt);
        if (prop) setPropGraph(prop);
        if (pass) setPassImpact(pass);
        if (Array.isArray(hist) && hist.length > 0) setSimulationHistory(hist);
      } catch (err) {
        console.error('Failed to fetch live model outputs:', err);
      }
    }

    syncDashboardWithBackend();
    const interval = setInterval(syncDashboardWithBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulation tick playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTick((prev) => {
          if (prev >= 120) {
            setIsPlaying(false);
            return 120;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const currentTickData = simulationHistory[currentTick] || null;

  const formatTickTime = (tick: number) => {
    const totalMins = 8 * 60 + tick * 2;
    const hrs = Math.floor(totalMins / 60) % 24;
    const mins = totalMins % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 || 12;
    return `${displayHrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleAcceptAction = async (actionId: string) => {
    if (!acceptedActions.includes(actionId)) {
      setAcceptedActions((prev) => [...prev, actionId]);
      setRejectedActions((prev) => prev.filter((id) => id !== actionId));

      try {
        await fetch('/api/quantum/action/decision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action_id: actionId, decision: 'ACCEPT', tick: currentTick })
        });
      } catch (e) {
        console.warn('Accept decision API error:', e);
      }
    }
  };

  const handleRejectAction = async (actionId: string, reason?: string, notes?: string) => {
    if (!rejectedActions.includes(actionId)) {
      setRejectedActions((prev) => [...prev, actionId]);
      setAcceptedActions((prev) => prev.filter((id) => id !== actionId));

      try {
        await fetch('/api/quantum/action/decision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_id: actionId,
            decision: 'REJECT',
            tick: currentTick,
            reason: reason || '',
            notes: notes || ''
          })
        });
      } catch (e) {
        console.warn('Reject decision API error:', e);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        simTimeStr={formatTickTime(currentTick)}
        isPlaying={isPlaying}
      />

      {/* Main Operations Content Area */}
      <div className="main-content">
        <Header
          currentTick={currentTick}
          simTimeStr={formatTickTime(currentTick)}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onReset={() => setCurrentTick(0)}
          onTickChange={(t) => setCurrentTick(t)}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          activeScenario={activeScenario}
          onScenarioChange={setActiveScenario}
          onOpenAlerts={() => setIsAlertDrawerOpen(true)}
          onOpenDisruptionModal={() => setIsDisruptionModalOpen(true)}
        />

        <div className="dashboard-body">
          {activeTab === 'overview' && (
            <>
              {/* Top KPI Stat Cards */}
              <KpiSummaryGrid
                currentTickData={currentTickData}
                liveState={liveState}
                optResult={optResult}
                propGraph={propGraph}
                passImpact={passImpact}
                simulationHistory={simulationHistory}
                currentTick={currentTick}
              />

              {/* Main Center Row: Live Digital Twin Map + AI Decision Engine */}
              <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '20px' }}>
                <DigitalTwinMap
                  currentTickData={currentTickData}
                  acceptedActions={acceptedActions}
                  onSelectTrain={(tr) => setSelectedTrain(tr)}
                  onSelectStation={(st) => setSelectedStation(st)}
                  onOpenFilters={() => setIsMapFilterOpen(true)}
                />
                <AiDecisionEngine
                  onRunQuantumOptimization={() => setIsQuantumModalOpen(true)}
                  acceptedActionsCount={acceptedActions.length}
                  liveState={liveState}
                  optResult={optResult}
                  propGraph={propGraph}
                  passImpact={passImpact}
                  currentTickData={currentTickData}
                />
              </div>

              {/* Operator Candidate Actions (Accept / Reject Controls) */}
              <OperatorDecisionSpace
                acceptedActions={acceptedActions}
                rejectedActions={rejectedActions}
                onAcceptAction={handleAcceptAction}
                onRejectAction={handleRejectAction}
              />

              {/* Analytics, Counterfactuals & Event Timeline */}
              <AnalyticsGrid
                acceptedActionsCount={acceptedActions.length}
                passImpact={passImpact}
                optResult={optResult}
                propGraph={propGraph}
                currentTickData={currentTickData}
              />
            </>
          )}

          {activeTab === 'digital-twin' && (
            <div style={{ height: 'calc(100vh - 120px)' }}>
              <DigitalTwinMap
                currentTickData={currentTickData}
                acceptedActions={acceptedActions}
                onSelectTrain={(tr) => setSelectedTrain(tr)}
                onSelectStation={(st) => setSelectedStation(st)}
                onOpenFilters={() => setIsMapFilterOpen(true)}
              />
            </div>
          )}

          {activeTab === 'ai-predictions' && <AiPredictionsTab currentTickData={currentTickData} />}
          {activeTab === 'delay-propagation' && <DelayPropagationTab />}
          {activeTab === 'decision-space' && <DecisionSpaceTab />}
          {activeTab === 'quantum-optimizer' && <QuantumOptimizerTab />}
          {activeTab === 'what-if' && <WhatIfTab />}
          {activeTab === 'results' && <ResultsImpactTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'alerts' && <AlertsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <QuantumVsClassicalModal
        isOpen={isQuantumModalOpen}
        onClose={() => setIsQuantumModalOpen(false)}
        onApplySolution={() => handleAcceptAction('ACT_01')}
      />

      <TrainTelemetryModal
        train={selectedTrain}
        onClose={() => setSelectedTrain(null)}
      />

      <StationTelemetryModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      <DisruptionGeneratorModal
        isOpen={isDisruptionModalOpen}
        onClose={() => setIsDisruptionModalOpen(false)}
        onDisruptionInjected={() => setIsQuantumModalOpen(true)}
      />

      <AlertDrawer
        isOpen={isAlertDrawerOpen}
        onClose={() => setIsAlertDrawerOpen(false)}
      />

      <MapFilterModal
        isOpen={isMapFilterOpen}
        onClose={() => setIsMapFilterOpen(false)}
      />
    </div>
  );
};

export default App;
