'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsHydrated(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative font-medium transition-colors duration-200 hover:text-olive-green
          ${isActive ? 'text-olive-green' : 'text-gray-600'}
        `}
      >
        {children}
        {isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-olive-green rounded-full animate-scale-in" />
        )}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass-header py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold heading-gradient flex items-center gap-2 group"
        >
          <span className="text-3xl group-hover:animate-float">🌾</span>
          GrainyMart
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {!isHydrated ? (
            <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <>
              {user ? (
                <>
                  <NavLink href="/shop">Shop</NavLink>

                  <div className="flex items-center gap-6 border-l border-gray-200 pl-6 ml-2">
                    <div className="group relative">
                      <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-olive-green transition-colors">
                        <User className="w-5 h-5" />
                        <span>{user.name.split(' ')[0]}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown */}
                      <div className="absolute top-full right-0 mt-2 w-48 py-2 glass-panel rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                        <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-olive-green/5 hover:text-olive-green">Profile</Link>
                        <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-olive-green/5 hover:text-olive-green">Orders</Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="block px-4 py-2 text-olive-green font-semibold hover:bg-olive-green/5">Admin Dashboard</Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                  <Link href="/login" className="font-medium text-gray-700 hover:text-olive-green transition-colors">Login</Link>
                  <Link href="/signup" className="btn-primary text-sm px-5 py-2.5 shadow-lg shadow-olive-green/20">Sign Up</Link>
                </div>
              )}

              <Link href="/cart" className="relative group p-2">
                <div className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-olive-green/30 group-hover:shadow-md transition-all">
                  <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-olive-green transition-colors" />
                </div>
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-wheat-gold text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                    {items.length}
                  </span>
                )}
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-700 hover:text-olive-green transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-panel border-t border-gray-100 shadow-xl animate-fade-up">
          <div className="container-custom py-6 px-4 flex flex-col space-y-4">
            {user && (
              <Link onClick={() => setIsMenuOpen(false)} href="/shop" className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100">Shop Resources</Link>
            )}

            {user ? (
              <>
                <Link onClick={() => setIsMenuOpen(false)} href="/profile" className="text-lg font-medium text-gray-800 py-2">Profile</Link>
                <Link onClick={() => setIsMenuOpen(false)} href="/orders" className="text-lg font-medium text-gray-800 py-2">My Orders</Link>
                {user.role === 'admin' && (
                  <Link onClick={() => setIsMenuOpen(false)} href="/admin" className="text-lg font-bold text-olive-green py-2">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="text-lg font-medium text-red-500 py-2 text-left flex items-center gap-2">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Link onClick={() => setIsMenuOpen(false)} href="/login" className="btn-secondary text-center justify-center">Login</Link>
                <Link onClick={() => setIsMenuOpen(false)} href="/signup" className="btn-primary text-center justify-center">Sign Up</Link>
              </div>
            )}

            <Link onClick={() => setIsMenuOpen(false)} href="/cart" className="flex items-center justify-between p-4 bg-olive-green/5 rounded-xl mt-2">
              <span className="font-medium text-olive-green">Shopping Cart</span>
              <div className="flex items-center gap-2">
                <span className="bg-olive-green text-white text-xs font-bold px-2 py-1 rounded-full">{items.length} items</span>
                <ShoppingCart className="w-5 h-5 text-olive-green" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
