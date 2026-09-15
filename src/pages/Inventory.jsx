import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Warehouse, ArrowRightLeft, TrendingDown, TrendingUp } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ product_id: '', warehouse_id: '', quantity: '', min_stock: '', max_stock: '' });
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [invRes, prodRes, whRes] = await Promise.all([
        fetch('/api/inventory'), fetch('/api/products'), fetch('/api/warehouses')
      ]);
      setInventory(await invRes.json());
      setProducts(await prodRes.json());
      setWarehouses(await whRes.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const body = { ...form, product_id: parseInt(form.product_id), warehouse_id: parseInt(form.warehouse_id), quantity: parseInt(form.quantity) || 0, min_stock: parseInt(form.min_stock) || 0, max_stock: parseInt(form.max_stock) || 0 };
    try {
      await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      addToast('Inventory record created', 'success');
      setModalOpen(false);
      fetchData();
    } catch (err) { addToast('Failed to create record', 'error'); }
  };

  const getProductName = (id) => products.find(p => p.id === id)?.name || `Product #${id}`;
  const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || `WH #${id}`;

  const filtered = inventory.filter(i =>
    getProductName(i.product_id).toLowerCase().includes(search.toLowerCase()) ||
    getWarehouseName(i.warehouse_id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brown-900">Inventory</h2>
          <p className="text-sm text-brown-400">Track stock levels across warehouses</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Items in Stock', value: inventory.reduce((s, i) => s + (i.quantity || 0), 0).toLocaleString(), icon: Warehouse, color: 'text-brown-600 bg-brown-100' },
          { label: 'Low Stock Items', value: inventory.filter(i => i.quantity <= (i.min_stock || 10)).length, icon: TrendingDown, color: 'text-rose-600 bg-rose-100' },
          { label: 'Overstock Items', value: inventory.filter(i => i.quantity >= (i.max_stock || 500)).length, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-100' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5 flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${card.color}`}><card.icon className="w-5 h-5" /></div>
            <div><p className="text-xs text-brown-400 font-medium">{card.label}</p><p className="text-xl font-bold text-brown-900">{card.value}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-14 rounded-xl animate-shimmer" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-brown-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brown-50/50 border-b border-brown-200/50">
                  {['Product', 'Warehouse', 'Quantity', 'Min Stock', 'Max Stock', 'Status', 'Last Updated'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-brown-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const isLow = item.quantity <= (item.min_stock || 10);
                  const isOver = item.quantity >= (item.max_stock || 500);
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brown-100 last:border-0 hover:bg-brown-50/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-brown-900">{getProductName(item.product_id)}</td>
                      <td className="px-4 py-3 text-sm text-brown-600">{getWarehouseName(item.warehouse_id)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-brown-800">{item.quantity}</td>
                      <td className="px-4 py-3 text-xs text-brown-400">{item.min_stock}</td>
                      <td className="px-4 py-3 text-xs text-brown-400">{item.max_stock}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${isLow ? 'bg-rose-100 text-rose-700' : isOver ? 'bg-emerald-100 text-emerald-700' : 'bg-brown-100 text-brown-600'}`}>
                          {isLow ? 'Low Stock' : isOver ? 'Overstock' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-brown-400">{item.last_updated ? new Date(item.last_updated).toLocaleDateString() : '—'}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Inventory Record">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brown-700 mb-1.5">Product</label>
            <select value={form.product_id} onChange={(e) => setForm({...form, product_id: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none">
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-brown-700 mb-1.5">Warehouse</label>
            <select value={form.warehouse_id} onChange={(e) => setForm({...form, warehouse_id: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none">
              <option value="">Select warehouse</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          {[
            { label: 'Quantity', key: 'quantity' },
            { label: 'Min Stock Level', key: 'min_stock' },
            { label: 'Max Stock Level', key: 'max_stock' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-brown-700 mb-1.5">{f.label}</label>
              <input type="number" value={form[f.key]} onChange={(e) => setForm({...form, [f.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white gradient-brown rounded-xl shadow-lg">Create</button>
        </div>
      </Modal>
    </div>
  );
}
