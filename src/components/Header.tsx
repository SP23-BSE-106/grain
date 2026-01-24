'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-beige shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-wheat-brown hover:text-olive-green transition-colors duration-200">
            GrainyMart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/shop" className="text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium">
              Shop
            </Link>
            {user ? (
              <>
                <span className="text-olive-green font-medium">Hello, {user.name}</span>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium focus-ring"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium">
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
              <Link
                href="/shop"
                className="text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              {user ? (
                <>
                  <span className="text-olive-green font-medium">Hello, {user.name}</span>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-olive-green hover:text-wheat-brown transition-colors duration-200 font-medium focus-ring"
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
