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
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
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
  const password = watch('password') || '';

  // Password Strength Calculation
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return '';
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

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
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Strength: <span className={`font-medium ${strengthScore <= 2 ? 'text-red-500' : strengthScore <= 4 ? 'text-yellow-600' : 'text-green-600'}`}>{getStrengthText(strengthScore)}</span></span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor(strengthScore)}`}
                      style={{ width: `${(strengthScore / 5) * 100}%` }}
                    />
                  </div>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li className={password.length >= 8 ? 'text-green-600' : ''}>• 8+ characters</li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>• Uppercase letter</li>
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>• Lowercase letter</li>
                    <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>• Number</li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>• Special character</li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green transition-all"
                placeholder="••••••••"
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