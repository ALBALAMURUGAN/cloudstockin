import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Shield, UserCog } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

const roleColors = { Admin: 'bg-rose-100 text-rose-700', Manager: 'bg-blue-100 text-blue-700', Staff: 'bg-brown-100 text-brown-700' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Staff', status: 'active' });
  const { addToast } = useToast();

  const fetchData = async () => {
    try { const res = await fetch('/api/user-roles'); setUsers(await res.json()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    try {
      if (selected) {
        await fetch('/api/user-roles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, ...form }) });
        addToast('User updated', 'success');
      } else {
        await fetch('/api/user-roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        addToast('User created', 'success');
      }
      setModalOpen(false); fetchData();
    } catch (err) { addToast('Failed to save', 'error'); }
  };

  const handleDelete = async () => {
    try { await fetch('/api/user-roles', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id }) }); addToast('User deleted', 'success'); setDeleteOpen(false); fetchData(); } catch (err) { addToast('Failed', 'error'); }
  };

  const openEdit = (u) => { setSelected(u); setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setModalOpen(true); };
  const openCreate = () => { setSelected(null); setForm({ name: '', email: '', role: 'Staff', status: 'active' }); setModalOpen(true); };

  const roleStats = { Admin: users.filter(u => u.role === 'Admin').length, Manager: users.filter(u => u.role === 'Manager').length, Staff: users.filter(u => u.role === 'Staff').length };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-brown-900">User & Role Management</h2><p className="text-sm text-brown-400">{filtered.length} users</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brown text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"><Plus className="w-4 h-4" /> Add User</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(roleStats).map(([role, count], i) => (
          <motion.div key={role} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className={`rounded-xl px-4 py-3 ${roleColors[role]}`}>
            <div className="flex items-center gap-2 mb-1"><Shield className="w-4 h-4" /><span className="text-xs font-medium">{role}</span></div>
            <p className="text-xl font-bold">{count}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all" /></div>

      {loading ? <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-14 rounded-xl animate-shimmer" />)}</div> : (
        <div className="bg-white rounded-2xl border border-brown-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-brown-50/50 border-b border-brown-200/50">{['User', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-brown-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brown-100 last:border-0 hover:bg-brown-50/30 transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full gradient-brown flex items-center justify-center text-white text-xs font-bold">{u.name?.[0] || '?'}</div><span className="text-sm font-medium text-brown-900">{u.name}</span></div></td>
                    <td className="px-4 py-3 text-sm text-brown-600">{u.email}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${roleColors[u.role] || roleColors.Staff}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-brown-100 text-brown-600'}`}>{u.status}</span></td>
                    <td className="px-4 py-3 text-xs text-brown-400">{u.last_login || 'Never'}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-brown-100 text-brown-400 hover:text-brown-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button><button onClick={() => { setSelected(u); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-brown-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit User' : 'Add User'}>
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Full Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none" /></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Role</label><select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none">{['Admin', 'Manager', 'Staff'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-brown-700 mb-1.5">Status</label><select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50/50 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-brown-600 bg-brown-100 rounded-xl hover:bg-brown-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white gradient-brown rounded-xl shadow-lg">{selected ? 'Update' : 'Create'}</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete User" message={`Are you sure you want to delete "${selected?.name}"?`} />
    </div>
  );
}
