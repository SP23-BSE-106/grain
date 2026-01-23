'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/authStore';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
        router.push('/login');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error signing up');
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input {...register('name')} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-olive-green" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input {...register('email')} type="email" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-olive-green" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input {...register('password')} type="password" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-olive-green" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input {...register('confirmPassword')} type="password" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-olive-green" />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-olive-green text-white py-2 rounded hover:bg-wheat-brown transition">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-4">Already have an account? <a href="/login" className="text-olive-green">Sign In</a></p>
      </div>
    </div>
  );
};

export default Signup;