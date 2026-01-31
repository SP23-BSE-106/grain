'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [storeLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    setStoreLoaded(true);
  }, []);

  useEffect(() => {
    if (!storeLoaded) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [storeLoaded, user, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({ name: data.name, email: data.email });
      } else if (res.status === 401) {
        logout();
        router.push('/login');
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: profile?.name || '', email: profile?.email || '' });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-olive-green mb-8">My Profile</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-olive-green text-white rounded-lg hover:bg-wheat-brown transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-green focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="text-gray-900 capitalize">{profile?.role}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-900">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {editing && (
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-olive-green text-white rounded-lg hover:bg-wheat-brown transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/orders')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                View My Orders
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                View My Cart
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
