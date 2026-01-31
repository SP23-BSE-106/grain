'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2D3A1B] text-white pt-16 pb-8 border-t border-olive-green/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-wheat-gold rounded-full mix-blend-overlay filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-olive-green rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold mb-6 flex items-center gap-2 group cursor-pointer inline-flex">
              <span className="text-3xl group-hover:animate-bounce">🌾</span>
              <span className="heading-gradient bg-gradient-to-r from-white to-wheat-light">GrainyMart</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Premium organic grains and pulses, sourced directly from sustainable farms for your healthy lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-olive-green hover:scale-110 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <Facebook className="w-5 h-5 text-white/80" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-olive-green hover:scale-110 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <Twitter className="w-5 h-5 text-white/80" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-olive-green hover:scale-110 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <Instagram className="w-5 h-5 text-white/80" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-wheat-gold">Explore</h4>
            <ul className="space-y-3">
              {['Shop', 'About Us', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-wheat-gold">Categories</h4>
            <ul className="space-y-3">
              {['Whole Grains', 'Pulses', 'Rice', 'Superfoods'].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-wheat-gold">Stay Updated</h4>
            <p className="text-gray-400 mb-4 text-sm">Subscribe to our newsletter for exclusive offers and health tips.</p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-olive-green focus:bg-white/10 transition-all text-white placeholder-gray-500 backdrop-blur-sm"
              />
              <button className="w-full btn-primary py-3 hover:shadow-olive-green/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; 2026 GrainyMart. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
