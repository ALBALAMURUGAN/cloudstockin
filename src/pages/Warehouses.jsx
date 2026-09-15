import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Box, MapPin } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', capacity: '', manager: '', status: 'active' });
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/warehouses');
      setWarehouses(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = warehouses.filter(w => w.name?.toLowerCase().includes(search.toLowerCase()) || w.location?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    const body = { ...form, capacity: parseInt(form.capacity) || 0 };
    try {
      if (selected) {
        await fetch('/api/warehouses', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, ...body }) });
        addToast('Warehouse updated', 'success');
      } else {
        await fetch('/api/warehouses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        addToast('Warehouse created', 'success');
      }
      setModalOpen(false); fetchData();
    } catch (err) { addToast('Failed to save', 'error'); }
  };

  const handleDelete = async () => {
    try {
      await fetch('/api/warehouses', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id }) });
      addToast('Warehouse deleted', 'success'); setDeleteOpen(false); fetchData();
    } catch (err) { addToast('Failed to delete', 'error'); }
  };

  const openEdit = (w) => { setSelected(w); setForm({ name: w.name, location: w.location, capacity: String(w.capacity), manager: w.manager || '', status: w.status }); setModalOpen(true); };
  const openCreate = () => { setSelected(null); setForm({ name: '', location: '', capacity: '', manager: '', status: 'active' }); setModalOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-brown-900">Warehouses</h2><p className="text-sm text-brown-400">{filtered.length} warehouses</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"><Plus className="w-4 h-4" /> Add Warehouse</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search warehouses..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" />
      </div>

      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({length: 4}).map((_, i) => <div key={i} className="h-40 rounded-2xl animate-shimmer" />)}</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brown-100 text-brown-600"><Box className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-semibold text-brown-900">{w.name}</h3>
                    <p className="text-xs text-brown-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{w.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${w.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-brown-100 text-brown-600'}`}>{w.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded-lg bg-brown-50"><p className="text-[10px] text-brown-400">Capacity</p><p className="text-sm font-semibold text-brown-800">{w.capacity?.toLocaleString() || 0} units</p></div>
                <div className="p-2 rounded-lg bg-brown-50"><p className="text-[10px] text-brown-400">Manager</p><p className="text-sm font-semibold text-brown-800 truncate">{w.manager || 'Unassigned'}</p></div>
              </div>
              <div className="flex justify-end gap-1">
                <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg hover:bg-brown-100 text-brown-400 hover:text-brown-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => { setSelected(w); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-brown-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit Warehouse' : 'Add Warehouse'}>
        <div className="space-y-4">
          {[{ label: 'Name', key: 'name' }, { label: 'Location', key: 'location' }, { label: 'Capacity', key: 'capacity', type: 'number' }, { label: 'Manager', key: 'manager' }].map(f => (
            <div key={f.key}><label className="block text-xs font-semibold text-brown-700 mb-1.5">{f.label}</label><input type={f.type || 'text'} value={form[f.key]} onChange={(e) => setForm({...form, [f.key]: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          ))}
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Status</label><select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white gradient-brown rounded-xl shadow-lg">{selected ? 'Update' : 'Create'}</button>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Warehouse" message={`Are you sure you want to delete "${selected?.name}"?`} />
    </div>
  );
}
