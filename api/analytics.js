import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const [products, warehouses, po, so, inventory, suppliers, customers] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('warehouses').select('*'),
        supabase.from('purchase_orders').select('*'),
        supabase.from('sales_orders').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('suppliers').select('*'),
        supabase.from('customers').select('*'),
      ]);

      const totalProducts = products.data?.length || 0;
      const totalWarehouses = warehouses.data?.length || 0;
      const inventoryValue = products.data?.reduce((sum, p) => sum + (p.price * p.quantity), 0) || 0;
      const lowStockItems = products.data?.filter(p => p.quantity <= p.reorder_level).length || 0;
      const pendingPO = po.data?.filter(o => o.status === 'pending').length || 0;
      const pendingSO = so.data?.filter(o => o.status === 'pending').length || 0;
      const totalSales = so.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const totalPurchases = po.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

      return res.status(200).json({
        totalProducts, totalWarehouses, inventoryValue, lowStockItems,
        pendingPO, pendingSO, totalSales, totalPurchases,
        totalSuppliers: suppliers.data?.length || 0,
        totalCustomers: customers.data?.length || 0,
        products: products.data || [],
        warehouses: warehouses.data || [],
        purchaseOrders: po.data || [],
        salesOrders: so.data || [],
        inventory: inventory.data || [],
      });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
