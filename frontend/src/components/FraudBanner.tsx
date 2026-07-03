import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FraudBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start justify-between mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h4 className="text-destructive font-medium">Suspicious Activity Detected</h4>
              <p className="text-sm text-destructive/80 mt-1">
                We've flagged a recent transaction on your account. Please review your recent activity.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-destructive/60 hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
