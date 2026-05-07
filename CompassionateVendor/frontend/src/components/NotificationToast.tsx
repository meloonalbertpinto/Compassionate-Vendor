import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface NotificationToastProps {
  message: string | null;
  onClear: () => void;
}

export function NotificationToast({ message, onClear }: NotificationToastProps) {
  useEffect(() => {
    if (message) {
      const t = setTimeout(onClear, 3000);
      return () => clearTimeout(t);
    }
  }, [message, onClear]);

  return (
    <div className="toast-container">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message + Date.now()}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-card px-4 py-3 text-sm font-medium text-white"
            style={{
              border: '1px solid rgba(59,130,246,0.3)',
              boxShadow: '0 0 20px rgba(59,130,246,0.2)',
              minWidth: 220,
              pointerEvents: 'all',
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
