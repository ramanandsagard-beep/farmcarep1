import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import {
  TruckIcon,
  ShoppingBagIcon,
  CogIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: TruckIcon,
    titleKey: 'equipment_rental',
    descriptionKey: 'rent_modern_equipment',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: ShoppingBagIcon,
    titleKey: 'marketplace',
    descriptionKey: 'buy_sell_produce',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: CogIcon,
    titleKey: 'input_supplies',
    descriptionKey: 'quality_inputs',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: UserGroupIcon,
    titleKey: 'community',
    descriptionKey: 'connect_stakeholders',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    icon: ChartBarIcon,
    titleKey: 'analytics',
    descriptionKey: 'data_insights',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    icon: ShieldCheckIcon,
    titleKey: 'secure',
    descriptionKey: 'safe_transactions',
    color: 'bg-red-50 text-red-600'
  }
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Farmer",
    content: "FarmCare has revolutionized how I manage my farm. Easy equipment rental and great marketplace!",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Equipment Vendor",
    content: "The platform helps me reach more farmers. Business has grown 200% since joining.",
    rating: 5
  },
  {
    name: "Amit Patel",
    role: "Consumer",
    content: "Fresh produce delivered right to my door. Quality and convenience unmatched!",
    rating: 5
  }
];

export default function Home() {
  const { t } = useTranslation('common');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-green-light">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-green/10 to-accent-blue/10"></div>
        <div className="container relative py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-gradient">FarmCare</span>
                <br />
                <span className="text-gray-700">Agricultural Revolution</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Connect farmers, vendors, suppliers, transporters, and consumers in one unified agricultural ecosystem.
                Modern tools for traditional farming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="btn btn-primary text-lg px-8 py-4">
                  Get Started
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link href="#features" className="btn btn-outline text-lg px-8 py-4">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-green/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for
              <span className="text-gradient"> Modern Farming</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From equipment rental to marketplace, transport to analytics - we have it all in one platform.
            </p>
          </motion.div>

          <div className="grid-responsive">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How <span className="text-gradient">FarmCare</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, intuitive steps to connect with the agricultural community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your account and choose your role' },
              { step: '02', title: 'Connect', desc: 'Find farmers, vendors, or customers in your area' },
              { step: '03', title: 'Transact', desc: 'Rent, buy, sell, or transport with ease' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-primary-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our <span className="text-gradient">Community</span> Says
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-green text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Agricultural Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of farmers, vendors, and consumers already using FarmCare to grow their agricultural operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn bg-white text-primary-green hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Journey
              </Link>
              <Link href="#features" className="btn border-white text-white hover:bg-white hover:text-primary-green text-lg px-8 py-4">
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-green to-accent-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold">FarmCare</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting agricultural stakeholders through technology and innovation.
              </p>
              <div className="flex space-x-4">
                <GlobeAltIcon className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <span className="text-sm text-gray-400">Available in 4 languages</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/equipment" className="hover:text-white transition-colors">Equipment Rental</Link></li>
                <li><Link href="/inputs" className="hover:text-white transition-colors">Input Marketplace</Link></li>
                <li><Link href="/produce" className="hover:text-white transition-colors">Produce Market</Link></li>
                <li><Link href="/vehicles" className="hover:text-white transition-colors">Transport Services</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Partners</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FarmCare. All rights reserved. Empowering agriculture through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
