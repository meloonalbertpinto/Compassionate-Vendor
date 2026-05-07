import { motion } from 'framer-motion';
import { Zap, ShoppingCart, Eye } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface IdleScreenProps {
  onStart: () => void;
}

// Particle component
function Particle({ index }: { index: number }) {
  const left = `${(index * 7.3 + 3) % 100}%`;
  const delay = (index * 0.47) % 5;
  const duration = 8 + (index * 1.3) % 6;
  const size = 1 + (index % 3);

  return (
    <div
      className="particle"
      style={{
        left,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        background: index % 3 === 0
          ? 'rgba(59,130,246,0.6)'
          : index % 3 === 1
          ? 'rgba(139,92,246,0.5)'
          : 'rgba(16,185,129,0.5)',
      }}
    />
  );
}

export function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', width: '100%',
        padding: '20px',
      }}
    >
      {/* Particles */}
      <div className="particles">
        {Array.from({ length: 25 }).map((_, i) => <Particle key={i} index={i} />)}
      </div>

      {/* Floating orbs */}
      <motion.div
        style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo/Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{ marginBottom: 24, position: 'relative' }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
          border: '2px solid rgba(59,130,246,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(59,130,246,0.3)',
        }}>
          <ShoppingCart size={36} color="#60a5fa" />
        </div>
        {/* Pulse rings */}
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(59,130,246,0.4)',
            }}
            animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.6, 0] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="font-orbitron text-glow-blue"
        style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 900,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 8,
          letterSpacing: '0.05em',
        }}
      >
        Compassionate Vendor
      </motion.h1>

      {/* Subtitle */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 40,
        }}
      >
        {['Pick.', 'Know.', 'Trust.'].map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.15 }}
            style={{
              fontSize: '1.1rem', fontWeight: 600,
              color: i === 0 ? '#60a5fa' : i === 1 ? '#a78bfa' : '#34d399',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* Feature badges */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {[
          { icon: '🤖', label: 'AI Detection' },
          { icon: '🥗', label: 'Health Analysis' },
          { icon: '🔬', label: 'Freshness Scan' },
          { icon: '⚡', label: 'Auto Checkout' },
        ].map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="glass-card"
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ fontSize: '0.9rem' }}>{feat.icon}</span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>{feat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ y: 30, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="btn-primary pulse-blue"
        style={{
          padding: '16px 40px',
          fontSize: '1rem',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Zap size={18} />
        TAP TO START
      </motion.button>

      {/* Keyboard hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <span style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'Orbitron, sans-serif' }}>KEYBOARD:</span>
        {[
          { key: 'H', desc: 'Hand Detect' },
          { key: 'A', desc: 'Add Item' },
          { key: 'O', desc: 'Start Timer' },
          { key: 'SPACE', desc: 'Pay' },
          { key: 'T', desc: 'Alert' },
        ].map(({ key, desc }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="kbd-hint" style={{ minWidth: key.length > 1 ? 40 : 22, padding: '0 4px' }}>{key}</span>
            <span style={{ fontSize: '0.6rem', color: '#334155' }}>{desc}</span>
          </div>
        ))}
      </motion.div>

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <div style={{ width: 30, height: 30, borderTop: '2px solid rgba(59,130,246,0.4)', borderLeft: '2px solid rgba(59,130,246,0.4)', borderRadius: '4px 0 0 0' }} />
      </div>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <div style={{ width: 30, height: 30, borderTop: '2px solid rgba(139,92,246,0.4)', borderRight: '2px solid rgba(139,92,246,0.4)', borderRadius: '0 4px 0 0' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <div style={{ width: 30, height: 30, borderBottom: '2px solid rgba(16,185,129,0.4)', borderLeft: '2px solid rgba(16,185,129,0.4)', borderRadius: '0 0 0 4px' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <div style={{ width: 30, height: 30, borderBottom: '2px solid rgba(59,130,246,0.4)', borderRight: '2px solid rgba(59,130,246,0.4)', borderRadius: '0 0 4px 0' }} />
      </div>
    </motion.div>
  );
}
