import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { api } from '../lib/api';

const navigationItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Equipment', href: '/equipment', roles: ['FARMER', 'EQUIPMENT_VENDOR'] },
  { name: 'Inputs', href: '/inputs', roles: ['FARMER', 'INPUT_SUPPLIER'] },
  { name: 'Produce', href: '/produce', roles: ['FARMER', 'CONSUMER'] },
  { name: 'Transport', href: '/vehicles', roles: ['FARMER', 'TRANSPORTER'] },
  { name: 'Cart', href: '/cart', icon: ShoppingCartIcon },
  { name: 'Dashboard', href: '/dashboard', icon: UserIcon, requiresAuth: true },
  { name: 'Profile', href: '/profile', icon: UserIcon, requiresAuth: true },
];

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load cart count
  const loadCartCount = async () => {
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const cartItems = await api('/cart', {}, token);
      setCartCount(cartItems?.length || 0);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();
    // Refresh cart count every 30 seconds
    const interval = setInterval(loadCartCount, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const filteredNavItems = navigationItems.filter(item =>
    !item.roles || !user || item.roles.includes(user.role) || !item.requiresAuth || user
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-green to-accent-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FarmCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isCart = item.name === 'Cart';
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    router.pathname === item.href
                      ? 'bg-primary-green-light text-primary-green-dark'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-green'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                  {isCart && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Admin Link */}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/analytics"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  router.pathname.startsWith('/admin')
                    ? 'bg-primary-green-light text-primary-green-dark'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-green'
                }`}
              >
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogoutIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      router.pathname === item.href
                        ? 'bg-primary-green-light text-primary-green-dark'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-green'
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    router.pathname.startsWith('/admin')
                      ? 'bg-primary-green-light text-primary-green-dark'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-green'
                  }`}
                >
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}
