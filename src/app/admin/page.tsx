'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Check,
  Clock,
  Truck,
  Search,
  Filter,
  MoreVertical,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { product: { name: string; price: number }; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === 'admin') {
            fetchData();
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [isHydrated, router]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/users?all=true')
      ]);

      if (productsRes.ok && ordersRes.ok && usersRes.ok) {
        setProducts(await productsRes.json());
        setOrders(await ordersRes.json());
        setUsers(await usersRes.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const handleCreateProduct = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          description: formData.description,
          image: formData.image,
          stock: parseInt(formData.stock),
        }),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '' });
        setShowProductModal(false);
        toast.success('Product created successfully');
      }
    } catch (error) {
      toast.error('Error creating product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          description: formData.description,
          image: formData.image,
          stock: parseInt(formData.stock),
        }),
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(products.map(p => p._id === editingProduct._id ? updatedProduct : p));
        setEditingProduct(null);
        setShowProductModal(false);
        setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '' });
        toast.success('Product updated successfully');
      }
    } catch (error) {
      toast.error('Error updating product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Product deleted');
      }
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status } : order
        ));
        toast.success(`Order status updated to ${status}`);
      }
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      stock: product.stock.toString(),
    });
    setShowProductModal(true);
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;

  if (loading) return (
    <div className="min-h-screen bg-beige-bg flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-olive-green border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-beige-bg pt-[73px]"> {/* Offset for fixed header */}
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your store operations</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '' });
              setShowProductModal(true);
            }}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-up">
          {[
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Products', value: totalProducts, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
            { label: 'Registered Users', value: totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover-lift">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/50 p-1 rounded-xl w-full md:w-auto inline-flex overflow-x-auto">
          {['products', 'orders', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 capitalize whitespace-nowrap ${activeTab === tab
                  ? 'bg-white text-olive-green shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="glass-panel rounded-3xl overflow-hidden min-h-[500px] animate-fade-up" style={{ animationDelay: '0.1s' }}>

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-olive-green/5 border-b border-olive-green/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-olive-green uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-olive-green uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-olive-green uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-olive-green uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-olive-green uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-olive-green/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt="" onError={(e) => (e.currentTarget.src = '/next.svg')} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => startEdit(product)} className="text-blue-600 hover:text-blue-900 mr-4 transition-transform hover:scale-110">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900 transition-transform hover:scale-110">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-olive-green/10 rounded-xl text-olive-green">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                          <span>•</span>
                          {order.user?.name || 'Guest'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="font-bold text-xl text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="pl-0 md:pl-16">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm mb-2 last:mb-0">
                          <span className="text-gray-700">{item.product?.name || 'Unknown Product'} <span className="text-gray-400">x{item.quantity}</span></span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.status !== 'delivered' && (
                      <div className="flex gap-3">
                        {order.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(order._id, 'shipped')} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                            <Truck className="w-4 h-4" /> Mark Shipped
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button onClick={() => updateOrderStatus(order._id, 'delivered')} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                            <Check className="w-4 h-4" /> Mark Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-olive-green/5 border-b border-olive-green/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-olive-green uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-olive-green uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-olive-green uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-olive-green uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-olive-green/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-olive-green/10 flex items-center justify-center text-olive-green font-bold text-xs mr-3">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {u.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="e.g. Organic Quinoa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field w-full"
                    placeholder="e.g. Grains"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field w-full"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Level</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-field w-full"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-field w-full"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field w-full min-h-[100px]"
                    placeholder="Product details..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setShowProductModal(false)} className="px-6 py-2 rounded-xl text-gray-600 hover:bg-gray-200 transition font-medium">
                Cancel
              </button>
              <button onClick={editingProduct ? handleUpdateProduct : handleCreateProduct} className="btn-primary px-8 py-2">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
