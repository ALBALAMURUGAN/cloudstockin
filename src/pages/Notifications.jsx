import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, AlertTriangle, Info, ShoppingCart, Package } from 'lucide-react';
import { useToast } from '../components/Toast';

const typeConfig = {
  low_stock: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  order_update: { icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  system: { icon: Info, color: 'text-brown-500', bg: 'bg-brown-50', border: 'border-brown-200' },
  delivery: { icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchData = async () => {
    try { const res = await fetch('/api/notifications'); setNotifications(await res.json()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const markRead = async (id) => {
    try { await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_read: true }) }); fetchData(); } catch (err) { addToast('Failed', 'error'); }
  };

  const markAllRead = async () => {
    try {
      await Promise.all(notifications.filter(n => !n.is_read).map(n => fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id, is_read: true }) })));
      addToast('All notifications marked as read', 'success');
      fetchData();
    } catch (err) { addToast('Failed', 'error'); }
  };

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-brown-900">Notifications</h2><p className="text-sm text-brown-400">{unread} unread notification{unread !== 1 ? 's' : ''}</p></div>
        {unread > 0 && <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brown-200 bg-white text-sm font-medium text-brown-700 hover:bg-brown-50 transition-colors"><CheckCheck className="w-4 h-4" />Mark all read</button>}
      </div>

      {loading ? <div className="space-y-3">{Array.from({length: 6}).map((_, i) => <div key={i} className="h-20 rounded-xl animate-shimmer" />)}</div> : (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const config = typeConfig[n.type] || typeConfig.system;
            const Icon = config.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-4 p-4 rounded-xl border ${n.is_read ? 'bg-white border-brown-200/50' : `${config.bg} ${config.border}`} transition-all hover:shadow-sm`}
              >
                <div className={`p-2 rounded-lg ${config.bg} ${config.color} flex-shrink-0`}><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-brown-900">{n.title}</h4>
                    <span className="text-[10px] text-brown-400 flex-shrink-0">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</span>
                  </div>
                  <p className="text-xs text-brown-500 mt-0.5">{n.message}</p>
                </div>
                {!n.is_read && <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg hover:bg-white/60 text-brown-400 hover:text-brown-700 transition-colors flex-shrink-0"><Check className="w-4 h-4" /></button>}
              </motion.div>
            );
          })}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16"><Bell className="w-12 h-12 text-brown-300 mb-3" /><p className="text-sm text-brown-400">No notifications yet</p></div>
          )}
        </div>
      )}
    </div>
  );
}
