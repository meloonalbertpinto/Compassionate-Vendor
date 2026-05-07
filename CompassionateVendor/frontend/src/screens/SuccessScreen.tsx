import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { AppAction } from '../store';

interface SuccessScreenProps {
  dispatch: React.Dispatch<AppAction>;
}

export function SuccessScreen({ dispatch }: SuccessScreenProps) {
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'GO_IDLE' }), 5000);
    return () => clearTimeout(t);
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', width: '100%',
        background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 70%)',
      }}
    >
      {/* Rings */}
      {[1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', borderRadius: '50%',
            border: `1px solid rgba(16,185,129,${0.4 - i * 0.07})`,
            width: i * 140, height: i * 140,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
        style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(16,185,129,0.15)',
          border: '2px solid rgba(16,185,129,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.2)',
          marginBottom: 32, position: 'relative', zIndex: 1,
        }}
      >
        <svg width={50} height={50} viewBox="0 0 50 50">
          <motion.path
            d="M10 25 L22 37 L42 15"
            fill="none"
            stroke="#10b981"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
          />
        </svg>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <h2
          className="font-orbitron text-glow-green"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 12,
          }}
        >
          Payment Successful
        </h2>
        <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: 8 }}>
          Thank you for choosing smart retail
        </p>
        <p style={{ fontSize: '0.78rem', color: '#334155', fontFamily: 'Orbitron, sans-serif' }}>
          Returning to home in 5 seconds...
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ marginTop: 32, width: 200, position: 'relative', zIndex: 1 }}
      >
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            style={{ background: '#10b981', width: '100%' }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </div>
      </motion.div>

      {/* Sparkles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 4, height: 4, borderRadius: '50%',
            background: '#34d399',
            left: `${20 + (i * 5.5)}%`,
            top: `${30 + (i % 4) * 10}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </motion.div>
  );
}
