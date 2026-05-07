import { motion } from 'framer-motion';
import { Camera, Zap } from 'lucide-react';

export function CameraFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{
        width: '100%', height: '100%',
        position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(59,130,246,0.3)',
        boxShadow: 'inset 0 0 40px rgba(59,130,246,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000',
      }}
    >
      {/* Real Stream from Backend */}
      <img
        src="http://localhost:5000/video_feed"
        alt="AI Vision Feed"
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: 0.8,
        }}
        onError={(e) => {
          // If stream fails, show a placeholder
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Futuristic Overlays */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* Scanning Line */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
            boxShadow: '0 0 15px #3b82f6',
            zIndex: 10,
          }}
        />

        {/* Corner Brackets */}
        <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderLeft: '2px solid #3b82f6', borderTop: '2px solid #3b82f6' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRight: '2px solid #3b82f6', borderTop: '2px solid #3b82f6' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 10, width: 20, height: 20, borderLeft: '2px solid #3b82f6', borderBottom: '2px solid #3b82f6' }} />
        <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderRight: '2px solid #3b82f6', borderBottom: '2px solid #3b82f6' }} />

        {/* AI Labels */}
        <div style={{ position: 'absolute', top: 10, left: 40, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} className="pulse-blue" />
          <span style={{ fontSize: '0.6rem', color: '#3b82f6', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>LIVE_VISION_ACTIVE</span>
        </div>
        
        <div style={{ position: 'absolute', bottom: 10, right: 40 }}>
          <span style={{ fontSize: '0.55rem', color: 'rgba(59,130,246,0.5)', fontFamily: 'monospace' }}>RES: 1280x720 | FPS: 30</span>
        </div>
      </div>

      {/* Empty State / Connecting */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.4 }}>
        <Camera size={32} color="#3b82f6" />
        <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontFamily: 'Orbitron, sans-serif' }}>CONNECTING_EYE...</div>
      </div>
    </motion.div>
  );
}
