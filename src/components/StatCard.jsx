import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeLabel, icon: Icon, color = 'brown', index = 0 }) {
  const colorMap = {
    brown: { bg: 'bg-brown-50', icon: 'bg-brown-500', text: 'text-brown-700', ring: 'ring-brown-200' },
    gold: { bg: 'bg-gold-50', icon: 'bg-gold-500', text: 'text-gold-700', ring: 'ring-gold-200' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-500', text: 'text-blue-700', ring: 'ring-blue-200' },
    rose: { bg: 'bg-rose-50', icon: 'bg-rose-500', text: 'text-rose-700', ring: 'ring-rose-200' },
    violet: { bg: 'bg-violet-50', icon: 'bg-violet-500', text: 'text-violet-700', ring: 'ring-violet-200' },
  };
  const c = colorMap[color] || colorMap.brown;
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-brown-200/50 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brown-100/30 -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${c.icon} text-white shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-xs font-medium text-brown-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-brown-900 tracking-tight">{value}</p>
        {changeLabel && <p className="text-xs text-brown-400 mt-1">{changeLabel}</p>}
      </div>
    </motion.div>
  );
}
