'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

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
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    setStoreLoaded(true);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const fetchData = async () => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    const token = getCookie('accessToken');
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/products', { headers }),
        fetch('/api/orders', { headers }),
        fetch('/api/users?all=true', { headers })
      ]);
      if (productsRes.ok && ordersRes.ok && usersRes.ok) {
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        setProducts(productsData);
        setOrders(ordersData);
        setUsers(usersData);
      } else {
        console.error('Failed to fetch data');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      router.push('/login');
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };
      const token = getCookie('accessToken');
      console.log('Admin: Token from cookie:', token ? 'present' : 'not present');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch('/api/verifyToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        console.log('Admin: Verify response:', data);
        if (!data.valid || data.user.role !== 'admin') {
          router.push('/login');
          return;
        }
        // Auth valid and role is admin, proceed
        fetchData();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };
    checkAuth();
  }, []);

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
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      stock: product.stock.toString(),
    });
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
        setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
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
      }
    } catch (error) {
      console.error('Error deleting product:', error);
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
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-beige text-gray-900">Loading...</div>;

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-olive-green mb-8">Admin Dashboard</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'products'
                ? 'bg-olive-green text-white'
                : 'bg-white text-olive-green border border-olive-green'
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'orders'
                ? 'bg-olive-green text-white'
                : 'bg-white text-olive-green border border-olive-green'
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'users'
                ? 'bg-olive-green text-white'
                : 'bg-white text-olive-green border border-olive-green'
            }`}
          >
            Manage Users
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Products</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  className="px-4 py-2 bg-olive-green text-white rounded hover:bg-green-700 transition text-sm sm:text-base"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({ name: '', category: '', price: '', description: '', image: '', stock: '' });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Stock</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2">{product.category}</td>
                      <td className="py-2">${product.price}</td>
                      <td className="py-2">{product.stock}</td>
                      <td className="py-2">
                        <div className="flex flex-col sm:flex-row gap-1">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block sm:hidden space-y-4">
              {products.map(product => (
                <div key={product._id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                  <p className="text-gray-600">Category: {product.category}</p>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-600">Stock: {product.stock}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">{order.user ? order.user.name : 'Unknown User'}</p>
                      <p className="text-sm text-gray-600">{order.user ? order.user.email : ''}</p>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total}</p>
                      <p className={`text-sm ${order.status === 'delivered' ? 'text-green-600' : order.status === 'shipped' ? 'text-blue-600' : 'text-yellow-600'}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm">
                        {item.product ? item.product.name : 'Product not found'} x {item.quantity} - ${item.price * item.quantity}
                      </p>
                    ))}
                  </div>
                  {order.status !== 'delivered' && (
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'shipped')}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b">
                      <td className="py-2">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.role}</td>
                      <td className="py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block sm:hidden space-y-4">
              {users.map(user => (
                <div key={user._id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Role: {user.role}</p>
                  <p className="text-gray-600">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
