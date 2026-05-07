import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface CircularTimerProps {
  seconds: number;
  maxSeconds?: number;
  active: boolean;
  size?: number;
}

export function CircularTimer({ seconds, maxSeconds = 30, active, size = 120 }: CircularTimerProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = seconds / maxSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  const color = useMemo(() => {
    if (seconds > 20) return '#10b981'; // green
    if (seconds > 10) return '#f59e0b'; // orange
    return '#ef4444';                   // red
  }, [seconds]);

  const glowColor = useMemo(() => {
    if (seconds > 20) return 'rgba(16,185,129,0.5)';
    if (seconds > 10) return 'rgba(245,158,11,0.5)';
    return 'rgba(239,68,68,0.5)';
  }, [seconds]);

  const isPulse = seconds <= 10 && active;

  return (
    <motion.div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={isPulse ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 0.8, repeat: isPulse ? Infinity : 0 }}
    >
      {/* Outer glow ring */}
      {active && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* SVG Timer */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={6}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
            transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
          }}
        />
      </svg>

      {/* Center text */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <motion.div
          style={{
            fontSize: size > 100 ? '1.8rem' : '1.4rem',
            fontWeight: 900,
            fontFamily: 'Orbitron, sans-serif',
            color,
            lineHeight: 1,
            textShadow: `0 0 15px ${color}`,
          }}
          animate={isPulse ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
          transition={{ duration: 0.5, repeat: isPulse ? Infinity : 0 }}
        >
          {seconds}
        </motion.div>
        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>
          SEC
        </div>
      </div>
    </motion.div>
  );
}
