import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, className = '', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
      className={`bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-brown-900">{title}</h3>
          {subtitle && <p className="text-xs text-brown-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}
