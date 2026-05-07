import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Leaf, Plus, Minus, ShoppingBag, Cpu, HandMetal } from 'lucide-react';
import type { AppStateData, AppAction, CartItem as CartItemType, ProductCatalog } from '../store';
import { NUTRITION_DB, PRODUCT_CATALOG, simulateFreshness } from '../store';
import { CartItem } from '../components/CartItem';
import { CircularTimer } from '../components/CircularTimer';
import { HealthInsightCard, FreshnessInsightCard, StatusBadge } from '../components/InsightCards';
import { CameraFeed } from '../components/CameraFeed';

interface ShoppingScreenProps {
  state: AppStateData;
  dispatch: React.Dispatch<AppAction>;
}

export function ShoppingScreen({ state, dispatch }: ShoppingScreenProps) {
  const { cart, timerActive, timerSeconds, insight } = state;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get the most recently added product
  const lastProduct = cart.length > 0 ? cart[cart.length - 1] : null;

  // Handle health scan
  const handleHealthScan = () => {
    if (!lastProduct) return;
    dispatch({ type: 'START_SCANNING', payload: { type: 'health' } });
    setTimeout(() => {
      const nutrition = NUTRITION_DB[lastProduct.category === 'Fruits' ? 'Fruits' :
        PRODUCT_CATALOG.find(p => p.name === lastProduct.name)?.nutritionKey || 'Salad'];
      dispatch({
        type: 'SCAN_HEALTH',
        payload: { nutrition: nutrition || NUTRITION_DB['Salad'], productName: lastProduct.name },
      });
    }, 2200);
  };

  // Handle freshness scan
  const handleFreshnessScan = () => {
    if (!lastProduct) return;
    dispatch({ type: 'START_SCANNING', payload: { type: 'freshness' } });
    setTimeout(() => {
      const freshness = simulateFreshness(lastProduct.name);
      dispatch({ type: 'SCAN_FRESHNESS', payload: { freshness, productName: lastProduct.name } });
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto 1fr',
        gap: 16,
        height: '100%',
        width: '100%',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      {/* === HEADER === */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
            border: '1px solid rgba(59,130,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingBag size={18} color="#60a5fa" />
          </div>
          <div>
            <div className="font-orbitron" style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.15em' }}>SHOPPING SESSION</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Compassionate Vendor</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* System status */}
          <StatusBadge
            label={timerActive ? 'TIMER ACTIVE' : 'READY'}
            color={timerActive ? (timerSeconds <= 10 ? 'red' : timerSeconds <= 20 ? 'yellow' : 'green') : 'green'}
            pulse={timerActive}
          />

          {/* AI status */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Cpu size={14} color="#60a5fa" />
            <span style={{ fontSize: '0.65rem', color: '#60a5fa', fontFamily: 'Orbitron, sans-serif' }}>AI ACTIVE</span>
          </motion.div>

          {/* Timer */}
          {timerActive && (
            <CircularTimer seconds={timerSeconds} active={timerActive} size={56} />
          )}

          {/* Checkout button */}
          {cart.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TRIGGER_PAYMENT' })}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.72rem' }}
            >
              Checkout ₹{total.toFixed(2)}
            </motion.button>
          )}
        </div>
      </div>

      {/* === LEFT: CART PANEL === */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Cart header */}
        <div className="glass-card-blue" style={{ padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={16} color="#60a5fa" />
              <span className="font-orbitron" style={{ fontSize: '0.72rem', color: '#60a5fa', letterSpacing: '0.1em' }}>
                SMART CART
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'Orbitron, sans-serif', color: '#60a5fa' }}>{itemCount}</div>
                <div style={{ fontSize: '0.6rem', color: '#475569' }}>ITEMS</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'Orbitron, sans-serif', color: '#34d399' }}>
                  ₹{total.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.6rem', color: '#475569' }}>TOTAL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cart items */}
        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: 160, gap: 10,
                }}
              >
                <HandMetal size={32} color="#1e3a5f" />
                <span style={{ fontSize: '0.78rem', color: '#334155', fontFamily: 'Orbitron, sans-serif', textAlign: 'center' }}>
                  Press <strong style={{ color: '#60a5fa' }}>H</strong> to detect hand,<br />
                  then <strong style={{ color: '#60a5fa' }}>A</strong> to add items
                </span>
              </motion.div>
            ) : (
              cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onAdd={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                  onRemove={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Quick-add product selector */}
        <div style={{ marginTop: 10 }}>
          <div className="font-orbitron" style={{ fontSize: '0.6rem', color: '#475569', letterSpacing: '0.15em', marginBottom: 8 }}>
            QUICK ADD (or press A to random)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PRODUCT_CATALOG.slice(0, 6).map((product) => (
              <motion.button
                key={product.name}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({
                  type: 'ADD_ITEM',
                  payload: {
                    id: product.nutritionKey,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    emoji: product.emoji,
                    category: product.category,
                    rating: product.rating,
                  }
                })}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '5px 10px',
                  cursor: 'pointer', color: '#94a3b8',
                  fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{product.emoji}</span>
                <span style={{ maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* === RIGHT: INSIGHT PANEL === */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleHealthScan}
            disabled={!lastProduct || insight.scanning}
            className="btn-green"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              opacity: (!lastProduct || insight.scanning) ? 0.5 : 1,
              justifyContent: 'center',
            }}
          >
            <Heart size={15} />
            Check Health
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFreshnessScan}
            disabled={!lastProduct || insight.scanning}
            className="btn-purple"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              opacity: (!lastProduct || insight.scanning) ? 0.5 : 1,
              justifyContent: 'center',
            }}
          >
            <Leaf size={15} />
            Check Freshness
          </motion.button>
        </div>

        {/* Product insight area */}
        <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
          {!insight.scanning && insight.type === null && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Real Camera Feed */}
              <div style={{ height: 260, flexShrink: 0 }}>
                <CameraFeed />
              </div>
              
              {/* Helpful hint card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: 20, textAlign: 'center' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px',
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Cpu size={20} color="#60a5fa" />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 6, fontFamily: 'Orbitron, sans-serif' }}>
                  AI VISION ACTIVE
                </div>
                <div style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.6 }}>
                  Hold any product in front of the camera for <span style={{ color: '#34d399' }}>instant health insights</span> and <span style={{ color: '#a78bfa' }}>freshness detection</span>.
                </div>
              </motion.div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {(insight.scanning || insight.type === 'health') && (
              <HealthInsightCard
                key="health"
                nutrition={insight.nutrition || NUTRITION_DB['Salad']}
                productName={insight.productName || ''}
                scanning={insight.scanning && insight.type === 'health'}
              />
            )}
            {(insight.scanning || insight.type === 'freshness') && (
              <FreshnessInsightCard
                key="freshness"
                freshness={insight.freshness || { freshness: 0, status: 'FRESH', spoilageRatio: 0, daysLeft: 0 }}
                productName={insight.productName || ''}
                scanning={insight.scanning && insight.type === 'freshness'}
              />
            )}
          </AnimatePresence>

          {/* Timer panel - when hand removed */}
          {timerActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card ${timerSeconds <= 10 ? 'glass-card-red pulse-red' : 'glass-card-blue'}`}
              style={{ padding: '16px', marginTop: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <CircularTimer seconds={timerSeconds} active={timerActive} size={80} />
                <div>
                  <div className="font-orbitron" style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: 4 }}>
                    PAYMENT WINDOW
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    {timerSeconds > 20 ? 'Please complete payment' :
                     timerSeconds > 10 ? '⚠️ Time running low!' :
                     '🚨 Urgent: Pay now!'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#475569' }}>
                    Press <span className="kbd-hint">SPACE</span> to simulate payment
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
