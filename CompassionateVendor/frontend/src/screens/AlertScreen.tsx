import { motion } from 'framer-motion';
import type { AppAction } from '../store';

interface AlertScreenProps {
  dispatch: React.Dispatch<AppAction>;
}

export function AlertScreen({ dispatch }: AlertScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="alert-blink"
      style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', width: '100%',
      }}
    >
      {/* Red radial background */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.15) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />

      {/* Corner warning bars */}
      <motion.div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.div
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      {/* Warning icon */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ position: 'relative', marginBottom: 24, zIndex: 1 }}
      >
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: `2px solid rgba(239,68,68,${0.5 - i * 0.1})`,
            }}
            animate={{ scale: [1, 1.3 + i * 0.2], opacity: [0.8, 0] }}
            transition={{ duration: 1, delay: i * 0.25, repeat: Infinity }}
          />
        ))}
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: 'rgba(239,68,68,0.2)',
          border: '2px solid rgba(239,68,68,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(239,68,68,0.4)',
          fontSize: '2.5rem',
        }}>
          ⚠️
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <h2
          className="font-orbitron"
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 3rem)',
            fontWeight: 900,
            color: '#f87171',
            textShadow: '0 0 30px rgba(239,68,68,0.8)',
            marginBottom: 12,
            letterSpacing: '0.05em',
          }}
        >
          PAYMENT REQUIRED
        </h2>
        <p style={{ fontSize: '1rem', color: '#fca5a5', marginBottom: 6 }}>
          Please complete your transaction
        </p>
        <p style={{ fontSize: '0.78rem', color: '#ef4444', fontFamily: 'Orbitron, sans-serif' }}>
          TIME EXPIRED — SECURITY ALERT
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: 32, display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => dispatch({ type: 'PAYMENT_SUCCESS' })}
          style={{
            padding: '14px 28px',
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(239,68,68,0.5)',
            borderRadius: 12, color: '#f87171',
            fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
            fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em',
            boxShadow: '0 0 20px rgba(239,68,68,0.3)',
          }}
        >
          PAY NOW
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => dispatch({ type: 'GO_IDLE' })}
          style={{
            padding: '14px 28px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, color: '#64748b',
            fontFamily: 'Orbitron, sans-serif', fontWeight: 700,
            fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em',
          }}
        >
          CANCEL
        </motion.button>
      </motion.div>

      {/* Scanning lines effect */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: 1,
              background: 'rgba(239,68,68,0.15)',
              top: `${i * 14}%`,
            }}
            animate={{ opacity: [0, 1, 0], scaleY: [1, 2, 1] }}
            transition={{ duration: 1, delay: i * 0.12, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}
