import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, ShoppingBag } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const statusColors = { pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-rose-100 text-rose-700' };

export default function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ so_number: '', customer_id: '', warehouse_id: '', status: 'pending', total_amount: '', items_count: '', order_date: '', shipped_date: '', notes: '' });
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [oRes, cRes, wRes] = await Promise.all([fetch('/api/sales-orders'), fetch('/api/customers'), fetch('/api/warehouses')]);
      setOrders(await oRes.json()); setCustomers(await cRes.json()); setWarehouses(await wRes.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = orders.filter(o => o.so_number?.toLowerCase().includes(search.toLowerCase()));
  const getCustomer = (id) => customers.find(c => c.id === id)?.name || `Customer #${id}`;
  const getWarehouse = (id) => warehouses.find(w => w.id === id)?.name || `WH #${id}`;

  const handleSave = async () => {
    const body = { ...form, customer_id: parseInt(form.customer_id) || null, warehouse_id: parseInt(form.warehouse_id) || null, total_amount: parseFloat(form.total_amount) || 0, items_count: parseInt(form.items_count) || 0 };
    try {
      if (selected) {
        await fetch('/api/sales-orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, ...body }) });
        addToast('Sales order updated', 'success');
      } else {
        await fetch('/api/sales-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        addToast('Sales order created', 'success');
      }
      setModalOpen(false); fetchData();
    } catch (err) { addToast('Failed to save', 'error'); }
  };

  const openEdit = (o) => { setSelected(o); setForm({ so_number: o.so_number, customer_id: String(o.customer_id || ''), warehouse_id: String(o.warehouse_id || ''), status: o.status, total_amount: String(o.total_amount || ''), items_count: String(o.items_count || ''), order_date: o.order_date || '', shipped_date: o.shipped_date || '', notes: o.notes || '' }); setModalOpen(true); };
  const openCreate = () => { setSelected(null); setForm({ so_number: `SO-${Date.now().toString().slice(-6)}`, customer_id: '', warehouse_id: '', status: 'pending', total_amount: '', items_count: '', order_date: new Date().toISOString().split('T')[0], shipped_date: '', notes: '' }); setModalOpen(true); };

  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-brown-900">Sales Orders</h2><p className="text-sm text-brown-400">Track and manage customer orders</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"><Plus className="w-4 h-4" /> New SO</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5"><p className="text-xs text-brown-400 font-medium">Total Orders</p><p className="text-2xl font-bold text-brown-900">{orders.length}</p></motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5"><p className="text-xs text-brown-400 font-medium">Total Revenue</p><p className="text-2xl font-bold text-emerald-700">${totalRevenue.toLocaleString()}</p></motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5"><p className="text-xs text-brown-400 font-medium">Pending Orders</p><p className="text-2xl font-bold text-amber-700">{orders.filter(o => o.status === 'pending').length}</p></motion.div>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by SO number..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" /></div>

      {loading ? <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-14 rounded-xl animate-shimmer" />)}</div> : (
        <div className="bg-white rounded-2xl border border-brown-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-brown-50/50 border-b border-brown-200/50">{['SO Number', 'Customer', 'Warehouse', 'Items', 'Amount', 'Order Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-brown-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brown-100 last:border-0 hover:bg-brown-50/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-brown-800">{o.so_number}</td>
                    <td className="px-4 py-3 text-sm text-brown-700">{getCustomer(o.customer_id)}</td>
                    <td className="px-4 py-3 text-xs text-brown-500">{getWarehouse(o.warehouse_id)}</td>
                    <td className="px-4 py-3 text-sm text-brown-700">{o.items_count}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-brown-800">${Number(o.total_amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-brown-500">{o.order_date || '—'}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusColors[o.status] || statusColors.pending}`}>{o.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => openEdit(o)} className="p-1.5 rounded-lg hover:bg-brown-100 text-brown-400 hover:text-brown-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Sales Order' : 'New Sales Order'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">SO Number</label><input value={form.so_number} onChange={(e) => setForm({...form, so_number: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Customer</label><select value={form.customer_id} onChange={(e) => setForm({...form, customer_id: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"><option value="">Select customer</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Warehouse</label><select value={form.warehouse_id} onChange={(e) => setForm({...form, warehouse_id: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"><option value="">Select warehouse</option>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Status</label><select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none">{['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Total Amount ($)</label><input type="number" value={form.total_amount} onChange={(e) => setForm({...form, total_amount: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Items Count</label><input type="number" value={form.items_count} onChange={(e) => setForm({...form, items_count: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Order Date</label><input type="date" value={form.order_date} onChange={(e) => setForm({...form, order_date: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Shipped Date</label><input type="date" value={form.shipped_date} onChange={(e) => setForm({...form, shipped_date: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white gradient-brown rounded-xl shadow-lg">{selected ? 'Update' : 'Create'}</button>
        </div>
      </Modal>
    </div>
  );
}
