import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Truck, Star, Mail, Phone } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', country: '', rating: '5', status: 'active' });
  const { addToast } = useToast();

  const fetchData = async () => {
    try { const res = await fetch('/api/suppliers'); setSuppliers(await res.json()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = suppliers.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    const body = { ...form, rating: parseInt(form.rating) || 5 };
    try {
      if (selected) {
        await fetch('/api/suppliers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, ...body }) });
        addToast('Supplier updated', 'success');
      } else {
        await fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        addToast('Supplier created', 'success');
      }
      setModalOpen(false); fetchData();
    } catch (err) { addToast('Failed to save', 'error'); }
  };

  const handleDelete = async () => {
    try { await fetch('/api/suppliers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id }) }); addToast('Supplier deleted', 'success'); setDeleteOpen(false); fetchData(); } catch (err) { addToast('Failed', 'error'); }
  };

  const openEdit = (s) => { setSelected(s); setForm({ name: s.name, email: s.email || '', phone: s.phone || '', address: s.address || '', city: s.city || '', country: s.country || '', rating: String(s.rating || 5), status: s.status }); setModalOpen(true); };
  const openCreate = () => { setSelected(null); setForm({ name: '', email: '', phone: '', address: '', city: '', country: '', rating: '5', status: 'active' }); setModalOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-brown-900">Suppliers</h2><p className="text-sm text-brown-400">{filtered.length} suppliers</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"><Plus className="w-4 h-4" /> Add Supplier</button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" /></div>

      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length: 6}).map((_, i) => <div key={i} className="h-48 rounded-2xl animate-shimmer" />)}</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-brown flex items-center justify-center text-white font-bold text-sm">{s.name?.[0] || '?'}</div>
                  <div><h3 className="text-sm font-semibold text-brown-900">{s.name}</h3><p className="text-xs text-brown-400">{s.city}{s.country ? `, ${s.country}` : ''}</p></div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-brown-100 text-brown-600'}`}>{s.status}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {s.email && <p className="text-xs text-brown-500 flex items-center gap-1.5"><Mail className="w-3 h-3" />{s.email}</p>}
                {s.phone && <p className="text-xs text-brown-500 flex items-center gap-1.5"><Phone className="w-3 h-3" />{s.phone}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">{Array.from({length: 5}).map((_, si) => <Star key={si} className={`w-3.5 h-3.5 ${si < (s.rating || 5) ? 'text-gold-400 fill-gold-400' : 'text-brown-200'}`} />)}</div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-brown-100 text-brown-400 hover:text-brown-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { setSelected(s); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-brown-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Supplier' : 'Add Supplier'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ label: 'Name', key: 'name', full: true }, { label: 'Email', key: 'email' }, { label: 'Phone', key: 'phone' }, { label: 'Address', key: 'address', full: true }, { label: 'City', key: 'city' }, { label: 'Country', key: 'country' }, { label: 'Rating (1-5)', key: 'rating', type: 'number' }, { label: 'Status', key: 'status', type: 'select', options: ['active', 'inactive'] }].map(f => (
            <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-semibold text-brown-700 mb-1.5">{f.label}</label>
              {f.type === 'select' ? <select value={form[f.key]} onChange={(e) => setForm({...form, [f.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none">{f.options.map(o => <option key={o} value={o}>{o}</option>)}</select> : <input type={f.type || 'text'} value={form[f.key]} onChange={(e) => setForm({...form, [f.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" />}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white gradient-brown rounded-xl shadow-lg">{selected ? 'Update' : 'Create'}</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Supplier" message={`Are you sure you want to delete "${selected?.name}"?`} />
    </div>
  );
}
