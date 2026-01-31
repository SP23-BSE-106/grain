'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
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
  };

  return (
    <header className="bg-beige shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-olive-green via-wheat-brown to-dark-green bg-clip-text text-transparent hover:from-dark-green hover:via-olive-green hover:to-wheat-brown transition-all duration-500 drop-shadow-lg hover:drop-shadow-xl transform hover:scale-105 animate-float">
            GrainyMart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {!isHydrated ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : user ? (
              <>
                <Link href="/shop" className="btn-secondary">
                  Shop
                </Link>
                <Link href="/profile" className="btn-secondary">
                  Profile
                </Link>
                <Link href="/orders" className="btn-secondary">
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="btn-secondary">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="btn-secondary">
                  Signup
                </Link>
              </>
            )}
            <Link href="/cart" className="relative p-2 hover:bg-white/50 rounded-full transition-colors duration-200">
              <ShoppingCart className="text-olive-green w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-wheat-brown text-white rounded-full px-2 py-1 text-xs font-bold animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-white/50 rounded-full transition-colors duration-200 focus-ring"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-olive-green" /> : <Menu className="w-6 h-6 text-olive-green" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-olive-green/20 animate-slide-in">
            <nav className="flex flex-col space-y-4 mt-4">
              {user ? (
                <>
                  <Link
                    href="/shop"
                    className="btn-secondary w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link
                    href="/profile"
                    className="btn-secondary w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="btn-secondary w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="btn-secondary w-fit"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="btn-secondary w-fit text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-secondary w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
              <Link
                href="/cart"
                className="flex items-center space-x-2 text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({items.length})</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
