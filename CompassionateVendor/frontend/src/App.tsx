import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { appReducer, initialState, PRODUCT_CATALOG } from './store';
import { IdleScreen } from './screens/IdleScreen';
import { ShoppingScreen } from './screens/ShoppingScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { AlertScreen } from './screens/AlertScreen';
import { NotificationToast } from './components/NotificationToast';
import { useBackendSync } from './hooks/useBackendSync';

// Animated background grid
function BackgroundLayer() {
  return (
    <>
      <div className="animated-bg" />
      <div className="grid-overlay" />
      {/* Floating gradient orbs */}
      <motion.div
        style={{
          position: 'fixed', width: 600, height: 600,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
          top: '-10%', left: '-10%',
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'fixed', width: 500, height: 500,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
          bottom: '-10%', right: '-10%',
        }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'fixed', width: 400, height: 400,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)',
          top: '40%', left: '40%',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

// State indicator in top-left
function StateIndicator({ state, backendConnected }: { state: string, backendConnected: boolean }) {
  const stateColor = {
    IDLE: '#60a5fa',
    SHOPPING: '#34d399',
    PAYMENT: '#f59e0b',
    SUCCESS: '#10b981',
    ALERT: '#ef4444',
  }[state] || '#94a3b8';

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        position: 'fixed', top: 16, left: 16, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
        border: `1px solid rgba(255,255,255,0.1)`,
        borderRadius: 12, padding: '8px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <motion.div
          style={{ width: 8, height: 8, borderRadius: '50%', background: stateColor }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span style={{ fontSize: '0.7rem', fontFamily: 'Orbitron, sans-serif', color: stateColor, fontWeight: 700 }}>
          {state}
        </span>
      </div>
      
      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 8, height: 8, borderRadius: '50%', 
          background: backendConnected ? '#10b981' : '#ef4444',
          boxShadow: backendConnected ? '0 0 12px #10b981' : '0 0 12px #ef4444'
        }} />
        <span style={{ fontSize: '0.7rem', fontFamily: 'Orbitron, sans-serif', color: backendConnected ? '#10b981' : '#ef4444', fontWeight: 700 }}>
          AI_LINK: {backendConnected ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [backendConnected, setBackendConnected] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync with real Python AI models
  useBackendSync(state, dispatch);

  // Check connection status
  useEffect(() => {
    const check = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/data');
        setBackendConnected(res.ok);
      } catch {
        setBackendConnected(false);
      }
    }, 1500);
    return () => clearInterval(check);
  }, []);

  // Timer tick
  useEffect(() => {
    if (state.timerActive) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.timerActive]);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key.toUpperCase()) {
      case 'H':
        // Hand detected → go to SHOPPING
        dispatch({ type: 'HAND_DETECTED' });
        break;

      case 'O':
        // Hand removed → start timer
        if (state.state === 'SHOPPING' || state.state === 'PAYMENT') {
          dispatch({ type: 'START_TIMER' });
          dispatch({ type: 'SET_NOTIFICATION', payload: '🖐️ Hand Removed — Timer Started' });
        }
        break;

      case 'A':
        // Add random item to cart
        if (state.state === 'SHOPPING' || state.state === 'PAYMENT') {
          const product = PRODUCT_CATALOG[Math.floor(Math.random() * PRODUCT_CATALOG.length)];
          dispatch({
            type: 'ADD_ITEM',
            payload: {
              id: product.nutritionKey,
              name: product.name,
              price: product.price,
              quantity: 1,
              emoji: product.emoji,
              category: product.category,
              rating: product.rating,
            },
          });
        }
        break;

      case 'R':
        // Remove last item
        if (state.cart.length > 0) {
          dispatch({ type: 'REMOVE_ITEM', payload: state.cart[state.cart.length - 1].id });
        }
        break;

      case ' ':
        // Spacebar → Payment success
        e.preventDefault();
        if (state.state === 'PAYMENT' || state.state === 'ALERT') {
          dispatch({ type: 'PAYMENT_SUCCESS' });
        } else if (state.state === 'SHOPPING' && state.cart.length > 0) {
          dispatch({ type: 'TRIGGER_PAYMENT' });
        }
        break;

      case 'T':
        // Trigger alert
        dispatch({ type: 'TRIGGER_ALERT' });
        break;

      case 'ESCAPE':
        dispatch({ type: 'GO_IDLE' });
        break;
    }
  }, [state.state, state.cart]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Background */}
      <BackgroundLayer />

      {/* State indicator */}
      <StateIndicator state={state.state} backendConnected={backendConnected} />

      {/* Notification Toast */}
      <NotificationToast
        message={state.notification}
        onClear={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
      />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <AnimatePresence mode="wait">
          {state.state === 'IDLE' && (
            <motion.div key="idle" style={{ width: '100%', height: '100%' }}>
              <IdleScreen onStart={() => dispatch({ type: 'HAND_DETECTED' })} />
            </motion.div>
          )}

          {state.state === 'SHOPPING' && (
            <motion.div key="shopping" style={{ width: '100%', height: '100%' }}>
              <ShoppingScreen state={state} dispatch={dispatch} />
            </motion.div>
          )}

          {state.state === 'PAYMENT' && (
            <motion.div key="payment" style={{ width: '100%', height: '100%' }}>
              <PaymentScreen state={state} dispatch={dispatch} />
            </motion.div>
          )}

          {state.state === 'SUCCESS' && (
            <motion.div key="success" style={{ width: '100%', height: '100%' }}>
              <SuccessScreen dispatch={dispatch} />
            </motion.div>
          )}

          {state.state === 'ALERT' && (
            <motion.div key="alert" style={{ width: '100%', height: '100%' }}>
              <AlertScreen dispatch={dispatch} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard hint overlay (bottom of screen) */}
      {state.state !== 'IDLE' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 10, alignItems: 'center',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 99, padding: '6px 16px',
            zIndex: 100,
          }}
        >
          {[
            { key: 'H', label: 'Detect' },
            { key: 'A', label: 'Add' },
            { key: 'O', label: 'Timer' },
            { key: 'R', label: 'Remove' },
            { key: 'SPACE', label: 'Pay' },
            { key: 'T', label: 'Alert' },
            { key: 'ESC', label: 'Reset' },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="kbd-hint" style={{ minWidth: key.length > 1 ? 36 : 22, padding: '0 4px', fontSize: '0.6rem' }}>{key}</span>
              <span style={{ fontSize: '0.58rem', color: '#334155' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
