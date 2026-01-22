import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCart, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  return (
    <header className="bg-beige p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-wheat-brown">GrainyMart</Link>
        <nav className="flex space-x-4">
          <Link href="/shop" className="text-olive-green hover:text-wheat-brown">Shop</Link>
          {user ? (
            <>
              <span className="text-olive-green">Hello, {user.name}</span>
              <button onClick={logout} className="text-olive-green hover:text-wheat-brown">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-olive-green hover:text-wheat-brown">Login</Link>
              <Link href="/signup" className="text-olive-green hover:text-wheat-brown">Signup</Link>
            </>
          )}
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-olive-green" />
            {items.length > 0 && <span className="absolute -top-2 -right-2 bg-wheat-brown text-white rounded-full px-2 py-1 text-xs">{items.length}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;