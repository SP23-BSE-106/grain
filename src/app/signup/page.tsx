'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin']),
  secretCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'admin' && !data.secretCode) {
    return false;
  }
  return true;
}, {
  message: "Secret code is required for admin accounts",
  path: ["secretCode"],
});

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
  secretCode?: string;
};

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'user', // Default to user
    }
  });
  const { login } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Account created successfully! Please log in.');
        router.push('/login');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error signing up');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-bg relative overflow-hidden py-12 px-4">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-olive-green/20 rounded-full blur-3xl transform -translate-x-1/3 -translate-y-1/3 animate-float" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-wheat-gold/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="glass-panel w-full max-w-lg p-8 md:p-10 rounded-3xl relative z-10 mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-4xl mb-4 animate-bounce">🌾</Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">Join GrainyMart</h2>
          <p className="text-gray-500">Create your account to start your healthy journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              {...register('name')}
              className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all"
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all"
                placeholder="••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all"
                placeholder="••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <div className="relative">
              <select
                {...register('role')}
                className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all appearance-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {selectedRole === 'admin' && (
            <div className="animate-fade-up bg-olive-green/5 p-4 rounded-xl border border-olive-green/10">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Secret Code</label>
              <input
                {...register('secretCode')}
                type="password"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all"
                placeholder="Enter admin secret code"
              />
              {errors.secretCode && <p className="text-red-500 text-sm mt-1">{errors.secretCode.message}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl shadow-lg shadow-olive-green/20 mt-4"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-olive-green font-semibold hover:text-dark-text transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;