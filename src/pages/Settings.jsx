import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Bell, Shield, Palette, Database } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [general, setGeneral] = useState({ company_name: 'CloudStock Inc.', timezone: 'UTC-5', language: 'English', currency: 'USD', date_format: 'MM/DD/YYYY' });
  const [notifications, setNotifications] = useState({ email_alerts: true, low_stock_alerts: true, order_updates: true, daily_summary: false, weekly_report: true });
  const [security, setSecurity] = useState({ two_factor: false, session_timeout: '30', password_policy: 'strong', ip_whitelist: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try { const res = await fetch('/api/settings'); setSettings(await res.json()); } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = () => { addToast('Settings saved successfully', 'success'); };

  const Toggle = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)} className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-brown-600' : 'bg-brown-200'}`}>
      <motion.div animate={{ x: checked ? 18 : 2 }} transition={{ duration: 0.2 }} className="absolute top-1 w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div><h2 className="text-xl font-bold text-brown-900">Settings</h2><p className="text-sm text-brown-400">Manage your application preferences</p></div>

      {/* General Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5"><Globe className="w-5 h-5 text-brown-500" /><h3 className="text-sm font-semibold text-brown-900">General Settings</h3></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ label: 'Company Name', key: 'company_name' }, { label: 'Timezone', key: 'timezone', type: 'select', options: ['UTC-5', 'UTC-8', 'UTC+0', 'UTC+1', 'UTC+8'] }, { label: 'Language', key: 'language', type: 'select', options: ['English', 'Spanish', 'French', 'German'] }, { label: 'Currency', key: 'currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'JPY'] }, { label: 'Date Format', key: 'date_format', type: 'select', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] }].map(f => (
            <div key={f.key}><label className="block text-xs font-semibold text-brown-700 mb-1.5">{f.label}</label>
              {f.type === 'select' ? <select value={general[f.key]} onChange={(e) => setGeneral({...general, [f.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none">{f.options.map(o => <option key={o} value={o}>{o}</option>)}</select> : <input value={general[f.key]} onChange={(e) => setGeneral({...general, [f.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5"><Bell className="w-5 h-5 text-brown-500" /><h3 className="text-sm font-semibold text-brown-900">Notification Preferences</h3></div>
        <div className="space-y-4">
          {[{ label: 'Email Alerts', desc: 'Receive email notifications for important events', key: 'email_alerts' }, { label: 'Low Stock Alerts', desc: 'Get notified when items fall below reorder level', key: 'low_stock_alerts' }, { label: 'Order Updates', desc: 'Notifications for purchase and sales order changes', key: 'order_updates' }, { label: 'Daily Summary', desc: 'Receive a daily summary of activities', key: 'daily_summary' }, { label: 'Weekly Report', desc: 'Get a weekly analytics report via email', key: 'weekly_report' }].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-brown-50 last:border-0">
              <div><p className="text-sm font-medium text-brown-900">{item.label}</p><p className="text-xs text-brown-400">{item.desc}</p></div>
              <Toggle checked={notifications[item.key]} onChange={(v) => setNotifications({...notifications, [item.key]: v})} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5"><Shield className="w-5 h-5 text-brown-500" /><h3 className="text-sm font-semibold text-brown-900">Security Settings</h3></div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2"><div><p className="text-sm font-medium text-brown-900">Two-Factor Authentication</p><p className="text-xs text-brown-400">Add an extra layer of security to your account</p></div><Toggle checked={security.two_factor} onChange={(v) => setSecurity({...security, two_factor: v})} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Session Timeout (min)</label><input type="number" value={security.session_timeout} onChange={(e) => setSecurity({...security, session_timeout: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
            <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Password Policy</label><select value={security.password_policy} onChange={(e) => setSecurity({...security, password_policy: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"><option value="basic">Basic</option><option value="strong">Strong</option><option value="very-strong">Very Strong</option></select></div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"><Save className="w-4 h-4" />Save Changes</button>
      </div>
    </div>
  );
}
