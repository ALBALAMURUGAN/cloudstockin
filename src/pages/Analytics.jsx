import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Package, DollarSign, ShoppingCart, ShoppingBag } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import ChartCard from '../components/ChartCard';

const monthlyData = [
  { month: 'Jan', revenue: 42000, cost: 28000, profit: 14000 },
  { month: 'Feb', revenue: 48000, cost: 31000, profit: 17000 },
  { month: 'Mar', revenue: 55000, cost: 35000, profit: 20000 },
  { month: 'Apr', revenue: 51000, cost: 33000, profit: 18000 },
  { month: 'May', revenue: 62000, cost: 38000, profit: 24000 },
  { month: 'Jun', revenue: 58000, cost: 36000, profit: 22000 },
  { month: 'Jul', revenue: 67000, cost: 40000, profit: 27000 },
  { month: 'Aug', revenue: 72000, cost: 42000, profit: 30000 },
  { month: 'Sep', revenue: 69000, cost: 41000, profit: 28000 },
  { month: 'Oct', revenue: 78000, cost: 45000, profit: 33000 },
  { month: 'Nov', revenue: 85000, cost: 48000, profit: 37000 },
  { month: 'Dec', revenue: 92000, cost: 52000, profit: 40000 },
];

const categoryData = [
  { name: 'Electronics', value: 38, fill: '#6B4226' },
  { name: 'Furniture', value: 24, fill: '#C8A96E' },
  { name: 'Office Supplies', value: 18, fill: '#A67C52' },
  { name: 'Clothing', value: 12, fill: '#8B6342' },
  { name: 'Food & Bev', value: 8, fill: '#D4C0A0' },
];

const warehousePerf = [
  { name: 'Main WH', efficiency: 92, utilization: 78, accuracy: 98 },
  { name: 'West Coast', efficiency: 87, utilization: 65, accuracy: 96 },
  { name: 'European', efficiency: 91, utilization: 72, accuracy: 99 },
  { name: 'Asian Dist.', efficiency: 85, utilization: 58, accuracy: 95 },
];

const kpiData = [
  { label: 'Revenue YTD', value: '$782K', change: '+18.7%', icon: DollarSign, color: 'emerald' },
  { label: 'Orders Fulfilled', value: '1,247', change: '+12.3%', icon: ShoppingBag, color: 'blue' },
  { label: 'Avg Order Value', value: '$627', change: '+5.2%', icon: TrendingUp, color: 'gold' },
  { label: 'Inventory Turnover', value: '4.8x', change: '+0.6x', icon: BarChart3, color: 'brown' },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-brown-900">Analytics & Reports</h2><p className="text-sm text-brown-400">Comprehensive business intelligence dashboard</p></div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-brown-200/50 shadow-sm hover:shadow-md transition-all p-5">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
              <span className="text-xs font-semibold text-emerald-600">{kpi.change}</span>
            </div>
            <p className="text-xs text-brown-400 font-medium">{kpi.label}</p>
            <p className="text-2xl font-bold text-brown-900">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue, Cost & Profit" subtitle="Monthly financial overview" index={0}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6B4226" stopOpacity={0.2} /><stop offset="100%" stopColor="#6B4226" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9B8B7E' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9B8B7E' }} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8DDD0', fontSize: '12px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6B4226" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="cost" stroke="#C8A96E" strokeWidth={2} dot={false} name="Cost" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={false} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales by Category" subtitle="Product category distribution" index={1}>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={260}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8DDD0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.fill }} />
                  <span className="text-xs text-brown-600 flex-1">{cat.name}</span>
                  <span className="text-xs font-semibold text-brown-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Warehouse Performance */}
      <ChartCard title="Warehouse Performance" subtitle="Efficiency, utilization & accuracy metrics" index={2}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-brown-200">{['Warehouse', 'Efficiency', 'Utilization', 'Accuracy'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-brown-500 uppercase tracking-wider px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {warehousePerf.map((wh, i) => (
                <motion.tr key={wh.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="border-b border-brown-50 last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-brown-900">{wh.name}</td>
                  {['efficiency', 'utilization', 'accuracy'].map(metric => (
                    <td key={metric} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-brown-100 overflow-hidden"><div className="h-full rounded-full gradient-brown" style={{ width: `${wh[metric]}%` }} /></div>
                        <span className="text-xs font-semibold text-brown-700 w-8">{wh[metric]}%</span>
                      </div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Export Section */}
      <div className="bg-white rounded-2xl border border-brown-200/50 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-brown-900 mb-3">Export Reports</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Sales Report', 'Inventory Report', 'Purchase Report', 'Warehouse Report'].map(report => (
            <button key={report} className="p-3 rounded-xl border border-brown-200 hover:border-gold-400 hover:bg-gold-50 transition-all text-center">
              <BarChart3 className="w-5 h-5 text-brown-500 mx-auto mb-1" />
              <span className="text-xs font-medium text-brown-700">{report}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
