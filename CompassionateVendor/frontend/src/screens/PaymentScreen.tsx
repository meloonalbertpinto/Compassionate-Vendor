import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Wifi } from 'lucide-react';
import { CircularTimer } from '../components/CircularTimer';
import type { AppStateData, AppAction } from '../store';

interface PaymentScreenProps {
  state: AppStateData;
  dispatch: React.Dispatch<AppAction>;
}

export function PaymentScreen({ state, dispatch }: PaymentScreenProps) {
  const { cart, timerSeconds, timerActive } = state;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', width: '100%', padding: 20,
      }}
    >
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-orbitron"
          style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.2em' }}
        >
          — PAYMENT TERMINAL —
        </motion.div>

        {/* Amount display */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card-blue"
          style={{ width: '100%', padding: '24px 32px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.15em', marginBottom: 8 }}>
            TOTAL AMOUNT
          </div>
          <motion.div
            style={{
              fontSize: '3.5rem', fontWeight: 900,
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ₹{total.toFixed(2)}
          </motion.div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
            {cart.reduce((s, i) => s + i.quantity, 0)} items · Smart Cart
          </div>
        </motion.div>

        {/* Payment methods */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 12, width: '100%' }}
        >
          {[
            { icon: <CreditCard size={20} />, label: 'Card', color: '#60a5fa' },
            { icon: <Smartphone size={20} />, label: 'UPI', color: '#34d399' },
            { icon: <Wifi size={20} />, label: 'NFC', color: '#a78bfa' },
          ].map((method, i) => (
            <motion.div
              key={method.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -3 }}
              className="glass-card"
              style={{
                flex: 1, padding: '16px 12px', textAlign: 'center', cursor: 'pointer',
                border: `1px solid ${method.color}33`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}
            >
              <div style={{ color: method.color }}>{method.icon}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'Orbitron, sans-serif' }}>
                {method.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scanning animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card scan-line"
          style={{ width: '100%', padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          <motion.div
            style={{ fontSize: '2rem', marginBottom: 8 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📱
          </motion.div>
          <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>
            Tap Card / Phone to Terminal
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Or press <span className="kbd-hint">SPACE</span> to simulate payment
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <CircularTimer seconds={timerSeconds} active={timerActive} size={90} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
              Complete your payment
            </div>
            <div style={{ fontSize: '0.68rem', color: '#475569' }}>
              Time remaining for this session
            </div>
          </div>
        </motion.div>

        {/* Cart summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card"
          style={{ width: '100%', padding: '12px 16px' }}
        >
          <div style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'Orbitron, sans-serif', marginBottom: 8, letterSpacing: '0.1em' }}>
            ORDER SUMMARY
          </div>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {item.emoji} {item.name} ×{item.quantity}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>Total</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 900, fontFamily: 'Orbitron, sans-serif', color: '#60a5fa' }}>
              ₹{total.toFixed(2)}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
