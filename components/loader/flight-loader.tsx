"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createFlightScene, isWebGLAvailable, FlightSceneController } from './flight-scene';
import { LoaderHUD } from './loader-hud';
import './flight-loader.css';

interface FlightLoaderProps {
  onComplete?: () => void;
}

export default function FlightLoader({ onComplete }: FlightLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("INITIALIZING SYSTEMS");
  const [isExiting, setIsExiting] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneControllerRef = useRef<FlightSceneController | null>(null);
  const isSiteReadyRef = useRef<boolean>(false);

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

  // Main Progress & Phase Loop
  useEffect(() => {
    let animationFrameId: number;

    const animateProgress = () => {
      setProgress((current) => {
        const isReady = isSiteReadyRef.current;

        let next = current;
        if (!isReady && current < 92) {
          next = current + 0.35;
        } else if (isReady) {
          next = current + 1.4;
        }

        if (next > 100) next = 100;

        if (sceneControllerRef.current) {
          sceneControllerRef.current.updateProgress(next);
        }

        return next;
      });

      animationFrameId = requestAnimationFrame(animateProgress);
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Sync Phase Labels based on Progress Thresholds
  useEffect(() => {
    if (progress < 18) {
      setPhase("INITIALIZING SYSTEMS");
    } else if (progress < 38) {
      setPhase("SYSTEM CHECK / PASSENGERS ONBOARD");
    } else if (progress < 58) {
      setPhase("ENGINE SPOOLING");
    } else if (progress < 78) {
      setPhase("TAXIING & ACCELERATING");
    } else if (progress < 94) {
      setPhase("ROTATION & TAKEOFF");
    } else {
      setPhase("CLIMB & FLIGHT DECK");
    }

    if (progress >= 100 && !isExiting) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [progress, isExiting, onComplete]);

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
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 400);
  };

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
      <LoaderHUD progress={progress} phase={phase} onSkip={handleSkip} />
    </div>
  );
}
