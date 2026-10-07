"use client";

import React from 'react';

interface LoaderHUDProps {
  progress: number;
  phase: string;
  onSkip?: () => void;
}

const PASSENGERS_LIST = [
  { id: 'gate', label: 'GATE EXAM PREP', minProgress: 0 },
  { id: 'aiml', label: 'AI / ML PIPELINES', minProgress: 15 },
  { id: 'content', label: 'RESEARCH & WRITING', minProgress: 35 },
  { id: 'build', label: 'SAAS BUILDING', minProgress: 55 },
  { id: 'learn', label: 'DEEP LEARNING', minProgress: 75 },
  { id: 'create', label: 'CREATIVE WORK', minProgress: 90 },
];

export const LoaderHUD: React.FC<LoaderHUDProps> = ({ progress, phase, onSkip }) => {
  const displayPercent = Math.round(progress);

  return (
    <div className="flight-hud">
      {/* HUD Header Bar */}
      <div className="hud-header">
        <div className="hud-badge">
          <span className="hud-badge-dot" />
          <span>VAIBHAV / SYSTEM 01</span>
        </div>
        <div className="flex items-center gap-4">
          <span>FLIGHT MODE: TAKEOFF</span>
          {onSkip && (
            <button
              onClick={onSkip}
              className="hud-interactive-skip"
              title="Skip takeoff sequence"
            >
              SKIP INTRO [ESC]
            </button>
          )}
        </div>
      </div>

      {/* Central Progress Instrumentation Box */}
      <div className="hud-center">
        <div className="hud-title-wrap">
          <span className="hud-main-label">LOADING WEBSITE</span>
          <span className="hud-percent">{displayPercent}%</span>
        </div>

        <div className="hud-progress-track" role="progressbar" aria-valuenow={displayPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="hud-progress-fill" style={{ transform: `scaleX(${displayPercent / 100})` }} />
        </div>

        <div className="hud-status-bar">
          <span>SYSTEM TELEMETRY: OK</span>
          <span>
            STATUS: <span className="hud-status-phase">{phase}</span>
          </span>
        </div>
      </div>

      {/* Left Passenger Manifesto List */}
      <div className="hud-manifesto" aria-label="Flight passengers list">
        {PASSENGERS_LIST.map((item) => (
          <div
            key={item.id}
            className={`hud-manifesto-item ${progress >= item.minProgress ? 'active' : ''}`}
          >
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* HUD Bottom Grid Telemetry */}
      <div className="hud-footer">
        <div>
          <span>ALT: {(progress * 140).toFixed(0)} FT</span>
          <br />
          <span>SPD: {(progress * 3.2).toFixed(0)} KTS</span>
        </div>

        <div className="hud-footer-center">
          EVERYTHING YOU CARE ABOUT
          <br />
          IS ONBOARD
        </div>

        <div className="hud-footer-right">
          <span>LAT: 27.1767° N</span>
          <br />
          <span>LON: 78.0081° E</span>
        </div>
      </div>
    </div>
  );
};
