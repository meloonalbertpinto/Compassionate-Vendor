import { motion } from 'framer-motion';
import type { NutritionInfo, FreshnessInfo } from '../store';

// ===== STATUS BADGE =====
interface StatusBadgeProps {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
  pulse?: boolean;
}

const badgeColors = {
  green:  { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  text: '#34d399' },
  yellow: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)',  text: '#fbbf24' },
  red:    { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   text: '#f87171' },
  blue:   { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.4)',  text: '#60a5fa' },
  purple: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)',  text: '#a78bfa' },
};

export function StatusBadge({ label, color, pulse }: StatusBadgeProps) {
  const c = badgeColors[color];
  return (
    <motion.div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 99, padding: '4px 10px',
        fontSize: '0.7rem', fontWeight: 600, color: c.text,
        fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em',
      }}
      animate={pulse ? { boxShadow: [`0 0 8px ${c.border}`, `0 0 20px ${c.border}`, `0 0 8px ${c.border}`] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.text, boxShadow: `0 0 6px ${c.text}` }} />
      {label}
    </motion.div>
  );
}

// ===== NUTRITION INSIGHT CARD =====
interface HealthInsightCardProps {
  nutrition: NutritionInfo;
  productName: string;
  scanning: boolean;
}

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#e2e8f0' }}>{value}g</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          style={{ background: color, width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function HealthInsightCard({ nutrition, productName, scanning }: HealthInsightCardProps) {
  const ratingColor = { GREEN: 'green', YELLOW: 'yellow', RED: 'red' } as const;

  if (scanning) {
    return (
      <div className="glass-card scan-line" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
        <div className="shimmer" style={{ height: 120, borderRadius: 8 }} />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <motion.div
            style={{ fontSize: '0.85rem', color: '#60a5fa', fontFamily: 'Orbitron, sans-serif' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            🔬 Analyzing Nutrition...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card-${nutrition.rating === 'GREEN' ? 'green' : nutrition.rating === 'RED' ? 'red' : 'blue'}`}
      style={{ padding: 16 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em', marginBottom: 2 }}>
            HEALTH ANALYSIS
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{productName}</div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>Serving: {nutrition.serving}</div>
        </div>
        <StatusBadge label={nutrition.rating} color={ratingColor[nutrition.rating]} pulse />
      </div>

      {/* Calories */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
      }}>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Calories</span>
        <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Orbitron, sans-serif', color: '#f59e0b' }}>
          {nutrition.calories}
        </span>
        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>kcal</span>
      </div>

      {/* Macros */}
      <MacroBar label="Carbohydrates" value={nutrition.carbs} max={60} color="#f59e0b" />
      <MacroBar label="Protein" value={nutrition.protein} max={40} color="#60a5fa" />
      <MacroBar label="Fat" value={nutrition.fat} max={30} color="#f87171" />
      <MacroBar label="Fibre" value={nutrition.fibre} max={10} color="#34d399" />
      <MacroBar label="Sugar" value={nutrition.sugar} max={50} color="#a78bfa" />

      {/* Tip */}
      <div style={{
        marginTop: 10, padding: '8px 10px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8, borderLeft: `2px solid ${nutrition.rating === 'GREEN' ? '#10b981' : nutrition.rating === 'RED' ? '#ef4444' : '#f59e0b'}`,
      }}>
        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>💡 {nutrition.tip}</span>
      </div>
    </motion.div>
  );
}

// ===== FRESHNESS INSIGHT CARD =====
interface FreshnessInsightCardProps {
  freshness: FreshnessInfo;
  productName: string;
  scanning: boolean;
}

export function FreshnessInsightCard({ freshness, productName, scanning }: FreshnessInsightCardProps) {
  if (scanning) {
    return (
      <div className="glass-card scan-line" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
        <div className="shimmer" style={{ height: 100, borderRadius: 8 }} />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <motion.div
            style={{ fontSize: '0.85rem', color: '#a78bfa', fontFamily: 'Orbitron, sans-serif' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            🧬 Scanning Freshness...
          </motion.div>
        </div>
      </div>
    );
  }

  const statusColor = freshness.status === 'FRESH' ? '#34d399' : freshness.status === 'ACCEPTABLE' ? '#fbbf24' : '#f87171';
  const statusBg = freshness.status === 'FRESH' ? 'green' : freshness.status === 'ACCEPTABLE' ? 'yellow' : 'red';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card-${freshness.status === 'FRESH' ? 'green' : freshness.status === 'SPOILED' ? 'red' : 'blue'}`}
      style={{ padding: 16 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em', marginBottom: 2 }}>
            FRESHNESS SCAN
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{productName}</div>
        </div>
        <StatusBadge label={freshness.status} color={statusBg as 'green' | 'yellow' | 'red'} pulse />
      </div>

      {/* Freshness percentage */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 90, height: 90,
        }}>
          <svg width={90} height={90} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
            <circle cx={45} cy={45} r={38} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
            <motion.circle
              cx={45} cy={45} r={38} fill="none"
              stroke={statusColor} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 38}
              initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - freshness.freshness / 100) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${statusColor})` }}
            />
          </svg>
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Orbitron, sans-serif', color: statusColor }}>
              {freshness.freshness}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>%</span>
          </div>
        </div>
      </div>

      {/* Spoilage bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Spoilage Level</span>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: freshness.spoilageRatio > 0.05 ? '#f87171' : '#34d399' }}>
            {(freshness.spoilageRatio * 100).toFixed(1)}%
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            style={{ background: freshness.spoilageRatio > 0.05 ? '#ef4444' : '#10b981', width: 0 }}
            animate={{ width: `${Math.min(100, freshness.spoilageRatio * 300)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Days left */}
      <div style={{
        padding: '8px 12px', background: 'rgba(255,255,255,0.04)',
        borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Est. Days Left</span>
        <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif', color: statusColor }}>
          {freshness.daysLeft === 0 ? 'EXPIRED' : `${freshness.daysLeft} days`}
        </span>
      </div>

      {/* Warning */}
      {freshness.status === 'SPOILED' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: 10, padding: '8px 10px',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: 8, borderLeft: '2px solid #ef4444',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#fca5a5' }}>⚠️ Product may be spoiled. Do not consume.</span>
        </motion.div>
      )}
    </motion.div>
  );
}
