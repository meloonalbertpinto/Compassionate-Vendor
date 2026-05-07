import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../store';

interface CartItemProps {
  item: CartItemType;
  onAdd: () => void;
  onRemove: () => void;
}

const ratingColor = {
  GREEN: '#34d399',
  YELLOW: '#fbbf24',
  RED: '#f87171',
};

export function CartItem({ item, onAdd, onRemove }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass-card hover-lift"
      style={{ padding: '10px 14px', marginBottom: '8px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Emoji */}
        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.emoji}</div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.name}
            </span>
            <span
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: ratingColor[item.rating],
                flexShrink: 0,
                boxShadow: `0 0 6px ${ratingColor[item.rating]}`,
              }}
            />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.category}</div>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'Orbitron, sans-serif' }}>
            ₹{(item.price * item.quantity).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#475569' }}>
            ₹{item.price.toFixed(2)} ea
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onRemove}
            style={{
              width: 24, height: 24, borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.1)', color: '#f87171',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            {item.quantity === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
          </motion.button>
          <span style={{ width: 20, textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>
            {item.quantity}
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onAdd}
            style={{
              width: 24, height: 24, borderRadius: 6, border: '1px solid rgba(16,185,129,0.3)',
              background: 'rgba(16,185,129,0.1)', color: '#34d399',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Plus size={10} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
