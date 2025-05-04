'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { IoCloseOutline } from 'react-icons/io5';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Refresh the page to update auth state
      router.refresh();
      onClose();
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-light-900/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 text-light-600 hover:text-light-900"
          onClick={onClose}
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="font-display text-3xl text-light-900 uppercase">
            Log In
          </h2>
          <p className="mt-2 text-light-600">
            Or{' '}
            <Link href="/signup" className="text-gold-500 hover:text-gold-600 transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="form-checkbox"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-light-600">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link href="/forgot-password" className="text-gold-500 hover:text-gold-600">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
