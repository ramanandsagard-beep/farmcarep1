import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  TruckIcon,
  ShoppingBagIcon,
  CogIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarDaysIcon as CalendarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const roleConfig = {
  FARMER: {
    title: 'Farmer Dashboard',
    description: 'Manage your farm operations, equipment rentals, and produce sales',
    color: 'from-green-500 to-green-600',
    quickActions: [
      { href: '/produce/new', label: 'List New Produce', icon: PlusIcon, color: 'bg-green-500' },
      { href: '/equipment', label: 'Rent Equipment', icon: TruckIcon, color: 'bg-blue-500' },
      { href: '/vehicles', label: 'Book Transport', icon: TruckIcon, color: 'bg-purple-500' },
      { href: '/inputs', label: 'Buy Inputs', icon: ShoppingBagIcon, color: 'bg-orange-500' },
    ],
    stats: [
      { label: 'Active Bookings', value: '3', icon: CalendarIcon },
      { label: 'Listed Produce', value: '12', icon: ShoppingBagIcon },
      { label: 'Total Earnings', value: '₹45,200', icon: CurrencyDollarIcon },
    ]
  },
  EQUIPMENT_VENDOR: {
    title: 'Equipment Vendor Dashboard',
    description: 'Manage your equipment listings and rental bookings',
    color: 'from-blue-500 to-blue-600',
    quickActions: [
      { href: '/equipment/new', label: 'Add Equipment', icon: PlusIcon, color: 'bg-blue-500' },
      { href: '/equipment', label: 'View Listings', icon: EyeIcon, color: 'bg-green-500' },
      { href: '/bookings/equipment', label: 'Manage Bookings', icon: CalendarIcon, color: 'bg-purple-500' },
    ],
    stats: [
      { label: 'Total Equipment', value: '8', icon: TruckIcon },
      { label: 'Active Rentals', value: '5', icon: CalendarIcon },
      { label: 'Monthly Revenue', value: '₹28,500', icon: CurrencyDollarIcon },
    ]
  },
  INPUT_SUPPLIER: {
    title: 'Input Supplier Dashboard',
    description: 'Manage your agricultural input products and orders',
    color: 'from-purple-500 to-purple-600',
    quickActions: [
      { href: '/inputs/new', label: 'Add Product', icon: PlusIcon, color: 'bg-purple-500' },
      { href: '/inputs', label: 'View Products', icon: EyeIcon, color: 'bg-green-500' },
      { href: '/orders', label: 'Manage Orders', icon: DocumentTextIcon, color: 'bg-orange-500' },
    ],
    stats: [
      { label: 'Products Listed', value: '15', icon: ShoppingBagIcon },
      { label: 'Pending Orders', value: '7', icon: DocumentTextIcon },
      { label: 'Total Sales', value: '₹1,25,000', icon: CurrencyDollarIcon },
    ]
  },
  TRANSPORTER: {
    title: 'Transporter Dashboard',
    description: 'Manage your vehicle fleet and transport bookings',
    color: 'from-orange-500 to-orange-600',
    quickActions: [
      { href: '/vehicles/new', label: 'Add Vehicle', icon: PlusIcon, color: 'bg-orange-500' },
      { href: '/vehicles', label: 'View Fleet', icon: EyeIcon, color: 'bg-green-500' },
      { href: '/bookings/transport', label: 'Manage Bookings', icon: CalendarIcon, color: 'bg-blue-500' },
    ],
    stats: [
      { label: 'Vehicles', value: '4', icon: TruckIcon },
      { label: 'Active Trips', value: '2', icon: CalendarIcon },
      { label: 'Monthly Income', value: '₹18,750', icon: CurrencyDollarIcon },
    ]
  },
  CONSUMER: {
    title: 'Consumer Dashboard',
    description: 'Shop for fresh produce and agricultural inputs',
    color: 'from-indigo-500 to-indigo-600',
    quickActions: [
      { href: '/produce', label: 'Shop Produce', icon: ShoppingBagIcon, color: 'bg-green-500' },
      { href: '/inputs', label: 'Buy Inputs', icon: ShoppingBagIcon, color: 'bg-purple-500' },
      { href: '/cart', label: 'View Cart', icon: ShoppingBagIcon, color: 'bg-orange-500' },
      { href: '/orders', label: 'Order History', icon: DocumentTextIcon, color: 'bg-blue-500' },
    ],
    stats: [
      { label: 'Orders Placed', value: '12', icon: DocumentTextIcon },
      { label: 'Cart Items', value: '5', icon: ShoppingBagIcon },
      { label: 'Total Spent', value: '₹8,450', icon: CurrencyDollarIcon },
    ]
  },
  ADMIN: {
    title: 'Admin Dashboard',
    description: 'Monitor platform analytics and manage users',
    color: 'from-red-500 to-red-600',
    quickActions: [
      { href: '/admin/analytics', label: 'View Analytics', icon: ChartBarIcon, color: 'bg-red-500' },
      { href: '/users', label: 'Manage Users', icon: UserGroupIcon, color: 'bg-blue-500' },
      { href: '/notifications', label: 'Send Notifications', icon: DocumentTextIcon, color: 'bg-purple-500' },
    ],
    stats: [
      { label: 'Total Users', value: '1,247', icon: UserGroupIcon },
      { label: 'Active Orders', value: '89', icon: DocumentTextIcon },
      { label: 'Platform Revenue', value: '₹2,45,000', icon: CurrencyDollarIcon },
    ]
  },
};

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <Link href="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const config = roleConfig[user.role as keyof typeof roleConfig];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} text-white`}>
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {config.title}
            </h1>
            <p className="text-xl opacity-90 mb-6">
              {config.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm opacity-90">Welcome back, {user.name}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm opacity-75">Role:</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {user.role}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.href}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Link
                      href={action.href}
                      className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-green transition-colors">
                            {action.label}
                          </h3>
                          <p className="text-sm text-gray-500">Quick access</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="card text-center group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-primary-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary-green" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Activity</h2>
            <div className="card">
              <div className="space-y-4">
                {[
                  { action: 'Equipment booked', detail: 'Tractor rental for 3 days', time: '2 hours ago', type: 'booking' },
                  { action: 'Order placed', detail: '5kg Tomatoes', time: '1 day ago', type: 'order' },
                  { action: 'Payment received', detail: '₹2,500 for equipment rental', time: '2 days ago', type: 'payment' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'booking' ? 'bg-blue-500' :
                        activity.type === 'order' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.detail}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href="/activity" className="text-primary-green hover:text-primary-green-dark font-medium">
                  View All Activity →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Tips */}
      <section className="py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Getting Started Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold mb-3 text-gray-900">Complete Your Profile</h3>
                <p className="text-gray-600 mb-4">
                  Add your contact details and preferences to get better recommendations and faster service.
                </p>
                <Link href="/profile" className="btn btn-outline">
                  Update Profile
                </Link>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-3 text-gray-900">Explore Features</h3>
                <p className="text-gray-600 mb-4">
                  Discover all the tools and services available on FarmCare to maximize your agricultural operations.
                </p>
                <Link href="/help" className="btn btn-outline">
                  Help & Support
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
