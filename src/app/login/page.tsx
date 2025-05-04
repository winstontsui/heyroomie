'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      router.push('/profile');
      router.refresh();
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-50 py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-light-200 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-light-200 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="font-display text-4xl text-light-900 uppercase tracking-tight">
            Log In
          </h2>
          <p className="mt-3 text-light-600">
            Or{' '}
            <Link href="/signup" className="text-gold-500 hover:text-gold-600 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white p-8 rounded-xl border border-light-300 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-md">
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
