'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/authStore';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        login(result.user, result.accessToken);
        router.push('/');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error logging in');
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <button type="submit" disabled={loading} className="w-full bg-olive-green text-white py-2 rounded hover:bg-wheat-brown transition">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4">Don&apos;t have an account? <a href="/signup" className="text-olive-green">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;