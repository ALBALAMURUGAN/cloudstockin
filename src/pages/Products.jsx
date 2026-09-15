import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Filter, Package, Upload } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

const categories = ['Electronics', 'Furniture', 'Clothing', 'Food & Beverage', 'Office Supplies', 'Raw Materials'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', sku: '', category: 'Electronics', price: '', cost: '', quantity: '', reorder_level: '', status: 'active' });
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    const body = { ...form, price: parseFloat(form.price) || 0, cost: parseFloat(form.cost) || 0, quantity: parseInt(form.quantity) || 0, reorder_level: parseInt(form.reorder_level) || 0 };
    try {
      if (selected) {
        await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, ...body }) });
        addToast('Product updated successfully', 'success');
      } else {
        await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        addToast('Product created successfully', 'success');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) { addToast('Failed to save product', 'error'); }
  };

  const handleDelete = async () => {
    try {
      await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id }) });
      addToast('Product deleted', 'success');
      setDeleteOpen(false);
      fetchProducts();
    } catch (err) { addToast('Failed to delete', 'error'); }
  };

  const openEdit = (p) => { setSelected(p); setForm({ name: p.name, sku: p.sku, category: p.category, price: String(p.price), cost: String(p.cost), quantity: String(p.quantity), reorder_level: String(p.reorder_level), status: p.status }); setModalOpen(true); };
  const openCreate = () => { setSelected(null); setForm({ name: '', sku: '', category: 'Electronics', price: '', cost: '', quantity: '', reorder_level: '', status: 'active' }); setModalOpen(true); };

  const statusBadge = (s) => {
    const m = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-brown-100 text-brown-600', discontinued: 'bg-rose-100 text-rose-700' };
    return m[s] || m.active;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brown-900">Products</h2>
          <p className="text-sm text-brown-400">{filtered.length} products total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products by name, SKU, or category..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-brown-200 bg-white text-sm text-brown-600 hover:bg-brown-50 transition-colors"><Filter className="w-4 h-4" />Filter</button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-14 rounded-xl animate-shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="Add your first product to start managing inventory." action={<button onClick={openCreate} className="px-4 py-2 rounded-xl gradient-brown text-white text-sm font-semibold">Add Product</button>} />
      ) : (
        <div className="bg-white rounded-2xl border border-brown-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brown-50/50 border-b border-brown-200/50">
                  {['Product', 'SKU', 'Category', 'Price', 'Cost', 'Qty', 'Reorder', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-brown-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brown-100 last:border-0 hover:bg-brown-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brown-100 flex items-center justify-center flex-shrink-0"><Package className="w-4 h-4 text-brown-500" /></div>
                        <span className="text-sm font-medium text-brown-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-brown-500">{p.sku}</td>
                    <td className="px-4 py-3 text-xs text-brown-600">{p.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-brown-800">${Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-brown-600">${Number(p.cost).toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`text-sm font-semibold ${p.quantity <= p.reorder_level ? 'text-rose-600' : 'text-brown-800'}`}>{p.quantity}</span></td>
                    <td className="px-4 py-3 text-xs text-brown-400">{p.reorder_level}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusBadge(p.status)}`}>{p.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-brown-100 text-brown-400 hover:text-brown-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { setSelected(p); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-brown-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Product Name', key: 'name', type: 'text', full: true },
            { label: 'SKU', key: 'sku', type: 'text' },
            { label: 'Category', key: 'category', type: 'select', options: categories },
            { label: 'Price ($)', key: 'price', type: 'number' },
            { label: 'Cost ($)', key: 'cost', type: 'number' },
            { label: 'Quantity', key: 'quantity', type: 'number' },
            { label: 'Reorder Level', key: 'reorder_level', type: 'number' },
            { label: 'Status', key: 'status', type: 'select', options: ['active', 'inactive', 'discontinued'] },
          ].map(field => (
            <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-semibold text-brown-700 mb-1.5">{field.label}</label>
              {field.type === 'select' ? (
                <select value={form[field.key]} onChange={(e) => setForm({...form, [field.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all">
                  {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={field.type} value={form[field.key]} onChange={(e) => setForm({...form, [field.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white gradient-brown rounded-xl shadow-lg hover:shadow-xl transition-all">{selected ? 'Update' : 'Create'}</button>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Product" message={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`} />
    </div>
  );
}
