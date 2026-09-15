import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, ShoppingCart, Eye } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const statusColors = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-blue-100 text-blue-700', received: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-rose-100 text-rose-700' };

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ po_number: '', supplier_id: '', warehouse_id: '', status: 'pending', total_amount: '', items_count: '', order_date: '', expected_date: '', notes: '' });
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [oRes, sRes, wRes] = await Promise.all([fetch('/api/purchase-orders'), fetch('/api/suppliers'), fetch('/api/warehouses')]);
      setOrders(await oRes.json()); setSuppliers(await sRes.json()); setWarehouses(await wRes.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = orders.filter(o => o.po_number?.toLowerCase().includes(search.toLowerCase()));
  const getSupplier = (id) => suppliers.find(s => s.id === id)?.name || `Supplier #${id}`;
  const getWarehouse = (id) => warehouses.find(w => w.id === id)?.name || `WH #${id}`;

  const handleSave = async () => {
    const body = { ...form, supplier_id: parseInt(form.supplier_id) || null, warehouse_id: parseInt(form.warehouse_id) || null, total_amount: parseFloat(form.total_amount) || 0, items_count: parseInt(form.items_count) || 0 };
    try {
      if (selected) {
        await fetch('/api/purchase-orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, ...body }) });
        addToast('Purchase order updated', 'success');
      } else {
        await fetch('/api/purchase-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        addToast('Purchase order created', 'success');
      }
      setModalOpen(false); fetchData();
    } catch (err) { addToast('Failed to save', 'error'); }
  };

  const openEdit = (o) => { setSelected(o); setForm({ po_number: o.po_number, supplier_id: String(o.supplier_id || ''), warehouse_id: String(o.warehouse_id || ''), status: o.status, total_amount: String(o.total_amount || ''), items_count: String(o.items_count || ''), order_date: o.order_date || '', expected_date: o.expected_date || '', notes: o.notes || '' }); setModalOpen(true); };
  const openCreate = () => { setSelected(null); setForm({ po_number: `PO-${Date.now().toString().slice(-6)}`, supplier_id: '', warehouse_id: '', status: 'pending', total_amount: '', items_count: '', order_date: new Date().toISOString().split('T')[0], expected_date: '', notes: '' }); setModalOpen(true); };

  const stats = { total: orders.length, pending: orders.filter(o => o.status === 'pending').length, approved: orders.filter(o => o.status === 'approved').length, received: orders.filter(o => o.status === 'received').length };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-brown-900">Purchase Orders</h2><p className="text-sm text-brown-400">Manage purchase orders from suppliers</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"><Plus className="w-4 h-4" /> New PO</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: 'Total', value: stats.total, color: 'bg-brown-100 text-brown-700' }, { label: 'Pending', value: stats.pending, color: 'bg-amber-100 text-amber-700' }, { label: 'Approved', value: stats.approved, color: 'bg-blue-100 text-blue-700' }, { label: 'Received', value: stats.received, color: 'bg-emerald-100 text-emerald-700' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={`rounded-xl px-3 py-2 ${s.color}`}><p className="text-[10px] font-medium opacity-70">{s.label}</p><p className="text-lg font-bold">{s.value}</p></motion.div>
        ))}
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by PO number..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" /></div>

      {loading ? <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-14 rounded-xl animate-shimmer" />)}</div> : (
        <div className="bg-white rounded-2xl border border-brown-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-brown-50/50 border-b border-brown-200/50">{['PO Number', 'Supplier', 'Warehouse', 'Items', 'Amount', 'Order Date', 'Expected', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-brown-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brown-100 last:border-0 hover:bg-brown-50/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-brown-800">{o.po_number}</td>
                    <td className="px-4 py-3 text-sm text-brown-700">{getSupplier(o.supplier_id)}</td>
                    <td className="px-4 py-3 text-xs text-brown-500">{getWarehouse(o.warehouse_id)}</td>
                    <td className="px-4 py-3 text-sm text-brown-700">{o.items_count}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-brown-800">${Number(o.total_amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-brown-500">{o.order_date || '—'}</td>
                    <td className="px-4 py-3 text-xs text-brown-500">{o.expected_date || '—'}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusColors[o.status] || statusColors.pending}`}>{o.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => openEdit(o)} className="p-1.5 rounded-lg hover:bg-brown-100 text-brown-400 hover:text-brown-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Purchase Order' : 'New Purchase Order'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">PO Number</label><input value={form.po_number} onChange={(e) => setForm({...form, po_number: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Supplier</label><select value={form.supplier_id} onChange={(e) => setForm({...form, supplier_id: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"><option value="">Select supplier</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Warehouse</label><select value={form.warehouse_id} onChange={(e) => setForm({...form, warehouse_id: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"><option value="">Select warehouse</option>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Status</label><select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none">{['pending', 'approved', 'received', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Total Amount ($)</label><input type="number" value={form.total_amount} onChange={(e) => setForm({...form, total_amount: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Items Count</label><input type="number" value={form.items_count} onChange={(e) => setForm({...form, items_count: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Order Date</label><input type="date" value={form.order_date} onChange={(e) => setForm({...form, order_date: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Expected Date</label><input type="date" value={form.expected_date} onChange={(e) => setForm({...form, expected_date: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-semibold text-brown-700 mb-1.5">Notes</label><textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none resize-none" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white gradient-brown rounded-xl shadow-lg">{selected ? 'Update' : 'Create'}</button>
        </div>
      </Modal>
    </div>
  );
}
