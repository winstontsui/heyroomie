'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect, createContext, useContext } from 'react';
import Image from 'next/image';

// Create a context for the login modal
export const LoginModalContext = createContext({
  openLoginModal: () => {},
});

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profilePicture, setProfilePicture] = useState('default');
  
  // Check if we're on the home page to handle login differently
  const isHomePage = pathname === '/';

  // Handle scroll effect for transparent to solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch user profile picture when session is loaded
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            if (data.profilePicture && data.profilePicture !== 'default') {
              setProfilePicture(data.profilePicture);
            } else {
              // Just use the static default image
              setProfilePicture('default');
            }
          }
        } catch (error) {
          // On any error, just use the default image
          console.error('Error fetching profile picture:', error);
          setProfilePicture('default');
        }
      }
    };
    
    fetchProfilePicture();
  }, [session]);

  const isActive = (path: string) => {
    return pathname === path ? 'text-gold-500 font-semibold' : 'nav-link';
  };

  // Determine if text should be white (only on home page before scrolling)
  const shouldUseWhiteText = isHomePage && !scrolled;
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-light-50/95 backdrop-blur-sm py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container-responsive">
        <div className="flex justify-between items-center">
          {/* Logo - white on landing page before scroll, otherwise dark */}
          <Link href="/" className={`font-display text-3xl transition-colors duration-200 tracking-wide font-bold ${shouldUseWhiteText ? 'text-white hover:text-gold-200' : 'text-light-900 hover:text-gold-500'}`}>
            HEYROOMIE
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* How It Works removed */}
            <Link href="/contact" className={shouldUseWhiteText ? 'text-white hover:text-gold-200 transition-colors' : isActive('/contact')}>
              CONTACT
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className={`flex items-center ${shouldUseWhiteText ? 'text-white hover:text-gold-200' : 'nav-link'}`}>
                    {/* Profile Picture */}
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-light-300">
                      <img 
                        src={profilePicture === 'default' ? '/images/defaults/default-avatar.svg' : `/api/profile-picture/${profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Simple fallback
                          e.currentTarget.src = '/images/defaults/default-avatar.svg';
                        }}
                      />
                    </div>
                    <span className="mr-1">MY ACCOUNT</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-light-50 rounded-md shadow-md border border-light-200 overflow-hidden z-10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-200 origin-top-right invisible group-hover:visible">
                    <Link href="/profile" className="block px-4 py-3 text-light-800 hover:bg-light-100 text-sm">
                      Edit Profile
                    </Link>
                    <Link href="/matches" className="block px-4 py-3 text-light-800 hover:bg-light-100 text-sm">
                      View Matches
                    </Link>
                    <button 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-3 text-light-800 hover:bg-light-100 text-sm border-t border-light-300"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {isHomePage ? (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                    className={`bg-transparent border-0 cursor-pointer ${shouldUseWhiteText ? 'text-white hover:text-gold-200' : 'nav-link'}`}
                  >
                    LOGIN
                  </button>
                ) : (
                  <Link href="/login" className="nav-link">
                    LOGIN
                  </Link>
                )}
                {isHomePage ? (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-signup-modal'))}
                    className="btn-primary"
                  >
                    Sign Up
                  </button>
                ) : (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-signup-modal'))}
                    className="btn-primary"
                  >
                    Sign Up
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className={shouldUseWhiteText ? 'text-white' : 'text-light-900'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-light-50 absolute top-full left-0 right-0 shadow-md border-t border-light-200">
          <div className="container-responsive py-6 flex flex-col space-y-4">
            {/* How It Works removed */}
            <Link href="/contact" className="nav-link py-2">
              CONTACT
            </Link>
            
            {session ? (
              <>
                <div className="h-px bg-dark-600 my-2"></div>
                <div className="flex items-center space-x-3 mb-2">
                  {/* Profile Picture in mobile menu */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-light-300">
                    <img 
                      src={profilePicture === 'default' ? '/images/defaults/default-avatar.svg' : `/api/profile-picture/${profilePicture}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Simple fallback
                        e.currentTarget.src = '/images/defaults/default-avatar.svg';
                      }}
                    />
                  </div>
                  <span className="font-medium text-light-800">{session.user?.name || 'My Account'}</span>
                </div>
                <Link href="/dashboard" className="nav-link py-2">
                  Dashboard
                </Link>
                <Link href="/profile" className="nav-link py-2">
                  Edit Profile
                </Link>
                <Link href="/matches" className="nav-link py-2">
                  View Matches
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-left nav-link py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-dark-600 my-2"></div>
                {isHomePage ? (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                    className="nav-link py-2 bg-transparent border-0 cursor-pointer text-left w-full"
                  >
                    Login
                  </button>
                ) : (
                  <Link href="/login" className="nav-link py-2">
                    Login
                  </Link>
                )}
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('open-signup-modal'));
                  }}
                  className="btn-primary w-full text-center"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
