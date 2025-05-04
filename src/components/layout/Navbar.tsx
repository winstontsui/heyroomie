'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600 font-semibold' : 'text-secondary-600 hover:text-primary-600';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-responsive py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            HeyRoomie
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-secondary-500 hover:text-secondary-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={isActive('/')}>
              Home
            </Link>
            
            {session ? (
              <>
                <Link href="/profile" className={isActive('/profile')}>
                  Profile
                </Link>
                <Link href="/matches" className={isActive('/matches')}>
                  Matches
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn-secondary text-sm py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={isActive('/login')}>
                  Login
                </Link>
                <Link href="/signup" className={isActive('/signup')}>
                  <span className="btn-primary text-sm py-1">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className={isActive('/')}>
                Home
              </Link>
              
              {session ? (
                <>
                  <Link href="/profile" className={isActive('/profile')}>
                    Profile
                  </Link>
                  <Link href="/matches" className={isActive('/matches')}>
                    Matches
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="btn-secondary text-sm py-1 w-min"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={isActive('/login')}>
                    Login
                  </Link>
                  <Link href="/signup" className={isActive('/signup')}>
                    <span className="btn-primary text-sm py-1">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
