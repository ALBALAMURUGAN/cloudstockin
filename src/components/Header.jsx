import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, Menu, Sun, Moon } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/inventory': 'Inventory',
  '/warehouses': 'Warehouses',
  '/suppliers': 'Suppliers',
  '/purchase-orders': 'Purchase Orders',
  '/sales-orders': 'Sales Orders',
  '/customers': 'Customers',
  '/analytics': 'Analytics & Reports',
  '/notifications': 'Notifications',
  '/user-management': 'User Management',
  '/settings': 'Settings',
};

export default function Header({ mobileOpen, setMobileOpen, notificationCount = 3 }) {
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const title = pageTitles[location.pathname] || 'CloudStock';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-brown-200/50">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-brown-100 text-brown-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-brown-900 tracking-tight">{title}</h1>
            <p className="text-[10px] text-brown-400 font-medium hidden sm:block">CloudStock Inventory Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${searchFocused ? 'border-gold-400 bg-white shadow-sm ring-2 ring-gold-400/20' : 'border-brown-200 bg-brown-50/50'}`}>
            <Search className="w-4 h-4 text-brown-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-sm text-brown-900 placeholder:text-brown-300 outline-none w-48"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="hidden lg:inline text-[10px] text-brown-300 bg-brown-100 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-brown-100 text-brown-500 hover:text-brown-700 transition-colors">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-brown-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full gradient-brown flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-brown-800">Admin</p>
                <p className="text-[10px] text-brown-400">Administrator</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-brown-400 hidden sm:block" />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-brown-200/50 py-2 z-50"
                >
                  <div className="px-3 py-2 border-b border-brown-100">
                    <p className="text-xs font-semibold text-brown-900">Admin User</p>
                    <p className="text-[10px] text-brown-400">admin@cloudstock.io</p>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm text-brown-600 hover:bg-brown-50 transition-colors">Profile Settings</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-brown-600 hover:bg-brown-50 transition-colors">Help & Support</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors">Sign Out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
