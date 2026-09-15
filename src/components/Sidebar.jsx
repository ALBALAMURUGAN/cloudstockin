import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Warehouse, Truck, ShoppingCart,
  ShoppingBag, Users, BarChart3, Bell, UserCog, Settings,
  ChevronLeft, Box, LogOut, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/warehouses', label: 'Warehouses', icon: Box },
  { path: '/suppliers', label: 'Suppliers', icon: Truck },
  { path: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { path: '/sales-orders', label: 'Sales Orders', icon: ShoppingBag },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/user-management', label: 'User Management', icon: UserCog },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const { signOut } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-brown-800/40">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl gradient-gold flex items-center justify-center shadow-lg">
          <Box className="w-5 h-5 text-brown-900" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight">CloudStock</span>
            <span className="text-[10px] text-brown-400 font-medium tracking-wider uppercase">Inventory Pro</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex ml-auto p-1 rounded-lg hover:bg-brown-800/60 text-brown-400 hover:text-brown-200 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block"
            >
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gold-400/20 text-gold-300'
                    : 'text-brown-300 hover:bg-brown-800/40 hover:text-brown-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gold-400"
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-gold-400' : 'group-hover:text-brown-200'}`} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-brown-800/40 px-4 py-4">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full gradient-brown flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brown-100 truncate">Admin User</p>
              <p className="text-[10px] text-brown-400 truncate">admin@cloudstock.io</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-brown-800/60 text-brown-400 hover:text-brown-200 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen bg-brown-900 border-r border-brown-800/50 sticky top-0 z-40"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-brown-900 z-50 lg:hidden flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-brown-800/60 text-brown-400"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
