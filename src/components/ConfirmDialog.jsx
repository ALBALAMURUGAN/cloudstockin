import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brown-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600"><AlertTriangle className="w-5 h-5" /></div>
              <h3 className="text-lg font-semibold text-brown-900">{title}</h3>
            </div>
            <p className="text-sm text-brown-500 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
