import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, AlertTriangle, ShoppingCart, ShoppingBag, Warehouse, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { CardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';

const COLORS = ['#6B4226', '#C8A96E', '#A67C52', '#8B6342', '#D4C0A0', '#4A2E1A'];

const salesTrendData = [
  { month: 'Jan', sales: 42000, purchases: 28000 },
  { month: 'Feb', sales: 48000, purchases: 32000 },
  { month: 'Mar', sales: 55000, purchases: 35000 },
  { month: 'Apr', sales: 51000, purchases: 30000 },
  { month: 'May', sales: 62000, purchases: 38000 },
  { month: 'Jun', sales: 58000, purchases: 34000 },
  { month: 'Jul', sales: 67000, purchases: 40000 },
  { month: 'Aug', sales: 72000, purchases: 42000 },
  { month: 'Sep', sales: 69000, purchases: 39000 },
  { month: 'Oct', sales: 78000, purchases: 45000 },
  { month: 'Nov', sales: 85000, purchases: 48000 },
  { month: 'Dec', sales: 92000, purchases: 52000 },
];

const inventoryMovementData = [
  { week: 'W1', inbound: 120, outbound: 95 },
  { week: 'W2', inbound: 85, outbound: 110 },
  { week: 'W3', inbound: 140, outbound: 125 },
  { week: 'W4', inbound: 95, outbound: 80 },
  { week: 'W5', inbound: 160, outbound: 130 },
  { week: 'W6', inbound: 110, outbound: 145 },
  { week: 'W7', inbound: 130, outbound: 100 },
  { week: 'W8', inbound: 150, outbound: 120 },
];

const topProductsData = [
  { name: 'Laptop Pro 15"', revenue: 124500, units: 83 },
  { name: 'Office Desk Elite', revenue: 89000, units: 178 },
  { name: 'Wireless Headset', revenue: 67200, units: 336 },
  { name: 'Monitor Ultra 27"', revenue: 56800, units: 71 },
  { name: 'Ergonomic Chair', revenue: 45600, units: 114 },
];

const warehouseDistData = [
  { name: 'Main Warehouse', value: 45, fill: '#6B4226' },
  { name: 'West Coast Hub', value: 25, fill: '#C8A96E' },
  { name: 'European Center', value: 18, fill: '#A67C52' },
  { name: 'Asian Dist. Center', value: 12, fill: '#8B6342' },
];

const recentTransactions = [
  { id: 'SO-2024-001', type: 'Sale', customer: 'TechCorp Inc.', amount: 12500, status: 'completed', date: '2 hours ago' },
  { id: 'PO-2024-015', type: 'Purchase', customer: 'GlobalParts Co.', amount: 8750, status: 'pending', date: '4 hours ago' },
  { id: 'SO-2024-002', type: 'Sale', customer: 'OfficeMax Ltd.', amount: 3200, status: 'processing', date: '6 hours ago' },
  { id: 'TR-2024-003', type: 'Transfer', customer: 'WH-East → WH-West', amount: 0, status: 'completed', date: '8 hours ago' },
  { id: 'SO-2024-003', type: 'Sale', customer: 'StartupXYZ', amount: 9800, status: 'completed', date: '12 hours ago' },
];

const lowStockAlerts = [
  { name: 'Wireless Keyboard', sku: 'KB-001', qty: 5, reorder: 20, warehouse: 'Main' },
  { name: 'USB-C Hub', sku: 'HB-003', qty: 8, reorder: 25, warehouse: 'West Coast' },
  { name: 'Monitor Stand', sku: 'MS-012', qty: 3, reorder: 15, warehouse: 'Main' },
  { name: 'Desk Lamp LED', sku: 'DL-007', qty: 12, reorder: 30, warehouse: 'European' },
];

const statusColors = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton count={6} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton /><ChartSkeleton />
        </div>
      </div>
    );
  }

  const stats = analytics || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl gradient-hero p-6 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full bg-brown-600/20 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Good morning, Admin! 👋</h2>
            <p className="text-brown-300 text-sm">Here's what's happening with your inventory today.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Last updated: Just now</span>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Products" value={stats.totalProducts || 0} change={12.5} changeLabel="vs last month" icon={Package} color="brown" index={0} />
        <StatCard title="Inventory Value" value={`$${((stats.inventoryValue || 0) / 1000).toFixed(0)}K`} change={8.3} changeLabel="vs last month" icon={DollarSign} color="gold" index={1} />
        <StatCard title="Low Stock" value={stats.lowStockItems || 0} change={-15.2} changeLabel="vs last week" icon={AlertTriangle} color="rose" index={2} />
        <StatCard title="Pending PO" value={stats.pendingPO || 0} change={5.0} changeLabel="new this week" icon={ShoppingCart} color="blue" index={3} />
        <StatCard title="Total Sales" value={`$${((stats.totalSales || 0) / 1000).toFixed(0)}K`} change={18.7} changeLabel="vs last month" icon={ShoppingBag} color="emerald" index={4} />
        <StatCard title="Warehouses" value={stats.totalWarehouses || 0} change={0} changeLabel="All active" icon={Warehouse} color="violet" index={5} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales & Purchase Trends" subtitle="Monthly overview for the current year" index={0}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesTrendData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6B4226" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6B4226" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="purchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8A96E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C8A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9B8B7E' }} axisLine={{ stroke: '#E8DDD0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9B8B7E' }} axisLine={{ stroke: '#E8DDD0' }} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8DDD0', fontSize: '12px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="sales" stroke="#6B4226" fill="url(#salesGrad)" strokeWidth={2} name="Sales" />
              <Area type="monotone" dataKey="purchases" stroke="#C8A96E" fill="url(#purchGrad)" strokeWidth={2} name="Purchases" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Movement" subtitle="Weekly inbound vs outbound" index={1}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={inventoryMovementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D4" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9B8B7E' }} axisLine={{ stroke: '#E8DDD0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9B8B7E' }} axisLine={{ stroke: '#E8DDD0' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8DDD0', fontSize: '12px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="inbound" fill="#6B4226" radius={[4, 4, 0, 0]} name="Inbound" />
              <Bar dataKey="outbound" fill="#C8A96E" radius={[4, 4, 0, 0]} name="Outbound" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top Products by Revenue" subtitle="Best performing products this quarter" index={2}>
          <div className="space-y-3">
            {topProductsData.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-4"
              >
                <span className="w-6 h-6 rounded-lg bg-brown-100 text-brown-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-brown-900 truncate">{product.name}</span>
                    <span className="text-sm font-semibold text-brown-700 ml-2">${(product.revenue / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-brown-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.revenue / topProductsData[0].revenue) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                      className="h-full rounded-full gradient-brown"
                    />
                  </div>
                </div>
                <span className="text-xs text-brown-400 flex-shrink-0">{product.units} units</span>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Warehouse Distribution" subtitle="Stock allocation across facilities" index={3}>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={warehouseDistData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {warehouseDistData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8DDD0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {warehouseDistData.map((wh, i) => (
                <div key={wh.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: wh.fill }} />
                  <span className="text-xs text-brown-600 flex-1 truncate">{wh.name}</span>
                  <span className="text-xs font-semibold text-brown-800">{wh.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-brown-900">Recent Transactions</h3>
            <button className="text-xs font-medium text-brown-500 hover:text-brown-700 transition-colors">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brown-100">
                  <th className="text-left text-[10px] font-semibold text-brown-400 uppercase tracking-wider pb-2 pr-4">ID</th>
                  <th className="text-left text-[10px] font-semibold text-brown-400 uppercase tracking-wider pb-2 pr-4">Type</th>
                  <th className="text-left text-[10px] font-semibold text-brown-400 uppercase tracking-wider pb-2 pr-4">Party</th>
                  <th className="text-left text-[10px] font-semibold text-brown-400 uppercase tracking-wider pb-2 pr-4">Amount</th>
                  <th className="text-left text-[10px] font-semibold text-brown-400 uppercase tracking-wider pb-2 pr-4">Status</th>
                  <th className="text-left text-[10px] font-semibold text-brown-400 uppercase tracking-wider pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-brown-50 last:border-0 hover:bg-brown-50/50 transition-colors"
                  >
                    <td className="py-2.5 pr-4 text-xs font-mono font-medium text-brown-700">{tx.id}</td>
                    <td className="py-2.5 pr-4 text-xs font-medium text-brown-600">{tx.type}</td>
                    <td className="py-2.5 pr-4 text-xs text-brown-700">{tx.customer}</td>
                    <td className="py-2.5 pr-4 text-xs font-semibold text-brown-800">{tx.amount ? `$${tx.amount.toLocaleString()}` : '—'}</td>
                    <td className="py-2.5 pr-4"><span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusColors[tx.status]}`}>{tx.status}</span></td>
                    <td className="py-2.5 text-xs text-brown-400">{tx.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-brown-900">Low Stock Alerts</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">{lowStockAlerts.length}</span>
          </div>
          <div className="space-y-3">
            {lowStockAlerts.map((item, i) => (
              <motion.div
                key={item.sku}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3 rounded-xl border border-amber-200/50 bg-amber-50/30 hover:bg-amber-50/60 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-semibold text-brown-900">{item.name}</span>
                  <span className="text-[10px] font-mono text-brown-400">{item.sku}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-brown-500">{item.warehouse}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-rose-600 font-semibold">{item.qty} left</span>
                    <span className="text-[10px] text-brown-400">/ {item.reorder} reorder</span>
                  </div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-brown-100 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-400" style={{ width: `${Math.min((item.qty / item.reorder) * 100, 100)}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
