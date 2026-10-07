"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createFlightScene, isWebGLAvailable, FlightSceneController } from './flight-scene';
import { LoaderHUD } from './loader-hud';
import './flight-loader.css';

interface FlightLoaderProps {
  onComplete?: () => void;
}

function getPhaseForProgress(p: number): string {
  if (p < 18) return "INITIALIZING SYSTEMS";
  if (p < 38) return "SYSTEM CHECK / PASSENGERS ONBOARD";
  if (p < 58) return "ENGINE SPOOLING";
  if (p < 78) return "TAXIING & ACCELERATING";
  if (p < 94) return "ROTATION & TAKEOFF";
  return "CLIMB & FLIGHT DECK";
}

export default function FlightLoader({ onComplete }: FlightLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneControllerRef = useRef<FlightSceneController | null>(null);
  const isSiteReadyRef = useRef<boolean>(false);
  const progressRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Check prefers-reduced-motion and WebGL support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches) {
        setReducedMotion(true);
      }

      if (!isWebGLAvailable()) {
        setWebGLSupported(false);
      }
    }
  }, []);

  // Track Real Site Readiness (fonts, images, document state)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    async function checkSiteReadiness() {
      try {
        if (document.readyState !== 'complete') {
          await new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
        }
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (e) {
        console.warn("Readiness check fallback", e);
      } finally {
        if (isMounted) {
          isSiteReadyRef.current = true;
        }
      }
    }

    checkSiteReadiness();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mount WebGL Scene
  useEffect(() => {
    if (!webGLSupported || reducedMotion) return;

    if (containerRef.current && !sceneControllerRef.current) {
      const controller = createFlightScene();
      controller.mount(containerRef.current);
      sceneControllerRef.current = controller;
    }

    return () => {
      if (sceneControllerRef.current) {
        sceneControllerRef.current.destroy();
        sceneControllerRef.current = null;
      }
    };
  }, [webGLSupported, reducedMotion]);

  // Main High-Performance Progress Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animateProgress = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Rate: 16% per second while loading, 45% per second once ready
      const rate = isSiteReadyRef.current ? 45 : 16;
      progressRef.current = Math.min(100, progressRef.current + rate * delta);
      const val = progressRef.current;

      // Update 3D WebGL scene smoothly on every frame
      if (sceneControllerRef.current) {
        sceneControllerRef.current.updateProgress(val);
      }

      // Update React UI state only when display integer percentage changes
      setProgress((prev) => {
        const currentInt = Math.floor(val);
        const prevInt = Math.floor(prev);
        return currentInt !== prevInt ? val : prev;
      });

      if (val < 100) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        setIsExiting(true);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Keyboard shortcut (ESC key to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkip = () => {
    progressRef.current = 100;
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 300);
  };

  const currentPhase = getPhaseForProgress(progress);

  // Fallback for WebGL missing or Reduced Motion
  if (!webGLSupported || reducedMotion) {
    return (
      <div className={`flight-loader-container ${isExiting ? 'exiting' : ''}`}>
        <div className="flight-fallback">
          <div className="hud-badge mb-4">
            <span className="hud-badge-dot" />
            <span>VAIBHAV / PORTFOLIO TAKEOFF</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">TAKEOFF IN PROGRESS</h1>
          <p className="text-sm font-mono text-zinc-400 mb-8 max-w-md">
            {reducedMotion
              ? "Reduced motion enabled. Preparing portfolio data for instant access."
              : "WebGL not supported. Loading core architecture."}
          </p>
          <div className="w-full max-w-md bg-zinc-900 border-2 border-white p-1 mb-4">
            <div className="h-4 bg-lime-500 transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-mono text-xl font-bold text-lime-400">{Math.round(progress)}% COMPLETE</span>
          <button onClick={handleSkip} className="mt-8 hud-interactive-skip">
            ENTER SITE NOW →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flight-loader-container ${isExiting ? 'exiting' : ''}`}
      aria-label={`Website takeoff loading sequence: ${Math.round(progress)} percent complete`}
      aria-live="polite"
    >
      <div ref={containerRef} className="flight-canvas" />
      <LoaderHUD progress={progress} phase={currentPhase} onSkip={handleSkip} />
    </div>
  );
}
