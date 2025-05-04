'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { BsArrowRight, BsChatDots, BsShieldLockFill, BsHouseFill, BsStarFill, BsMapFill, BsChatDotsFill, BsGearFill } from 'react-icons/bs'
import { AiOutlineUser, AiOutlineCheckCircle } from 'react-icons/ai';
import { IoLocationOutline } from 'react-icons/io5';
import LoginModal from '@/components/auth/LoginModal';

export default function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // Add event listener for opening login modal from navbar
  useEffect(() => {
    const handleOpenLoginModal = () => setLoginModalOpen(true);
    window.addEventListener('open-login-modal', handleOpenLoginModal);
    
    return () => {
      window.removeEventListener('open-login-modal', handleOpenLoginModal);
    };
  }, []);

  return (
    <main className="bg-light-50 text-light-900 overflow-hidden">
      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-teal-500/10"></div>
          {/* Light background overlay */}
          <div className="absolute inset-0 bg-light-50/80"></div>
          {/* NYC skyline silhouette at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-light-100 opacity-80"></div>
        </div>
        
        <div className="container-responsive relative z-10 pt-32 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="hero-heading mb-6">
                  FIND YOUR <br />
                  ROOMMATE <br />
                  IN NYC
                </h1>
                <p className="text-xl text-light-700 mb-10 max-w-lg">
                  Match with compatible roommates based on your lifestyle, preferences, and personality. The smart way to find your perfect living partner in New York City.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup" className="btn-primary">
                    Get Started
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="flex gap-12 mt-12">
                  <div>
                    <p className="text-4xl font-display text-gold-500">5K+</p>
                    <p className="text-sm text-light-600 uppercase">Active Users</p>
                  </div>
                  <div>
                    <p className="text-4xl font-display text-gold-500">95%</p>
                    <p className="text-sm text-light-600 uppercase">Match Rate</p>
                  </div>
                  <div>
                    <p className="text-4xl font-display text-gold-500">24h</p>
                    <p className="text-sm text-light-600 uppercase">Avg Match Time</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block relative">
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative">
                  <Image src="/images/roommates-nyc.jpg" fill alt="Roommates in NYC" className="object-cover" />
                  
                  {/* Subtle darkening at the bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-light-900/30 to-transparent z-20"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8 z-30">
                    <div className="p-4 bg-white/90 backdrop-blur-md rounded-lg border border-light-300 shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-2 w-2 rounded-full bg-gold-500"></div>
                        <p className="text-sm font-medium text-light-800">FEATURED MATCH</p>
                      </div>
                      <p className="text-lg font-semibold text-light-900">Upper East Side • $1,800-2,400</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="match-badge">92% Match</div>
                        <Link href="/signup" className="text-gold-500 hover:text-gold-600 text-sm font-medium flex items-center transition-colors">
                          View Profile <BsArrowRight className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-light-100">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="section-heading">
              How It Works
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Our matching algorithm is designed to connect you with roommates who complement your lifestyle and preferences. 
              Get started in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="card border border-light-300 hover:border-gold-500 transition-colors duration-300 h-full flex flex-col">
                <div className="absolute -top-5 -left-5 bg-gold-500 w-10 h-10 flex items-center justify-center rounded">
                  <span className="text-black font-bold">1</span>
                </div>
                <div className="mb-6 text-gold-500">
                  <AiOutlineUser className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-4">Create Your Profile</h3>
                <p className="text-light-700 flex-grow">
                  Sign up and complete your profile with your lifestyle preferences, budget range, and neighborhood choices.
                </p>
                <div className="mt-6 pt-6 border-t border-light-300">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold-500"></div>
                    <span className="text-xs text-light-600">TAKES 5 MINUTES</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="card border border-light-300 hover:border-gold-500 transition-colors duration-300 h-full flex flex-col">
                <div className="absolute -top-5 -left-5 bg-gold-500 w-10 h-10 flex items-center justify-center rounded">
                  <span className="text-black font-bold">2</span>
                </div>
                <div className="mb-6 text-teal-500">
                  <AiOutlineCheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-4">Get Matched</h3>
                <p className="text-light-700 flex-grow">
                  Our algorithm analyzes your preferences to find compatible roommates with similar lifestyles and values.
                </p>
                <div className="mt-6 pt-6 border-t border-light-300">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
                    <span className="text-xs text-light-600">INSTANT RESULTS</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="card border border-light-300 hover:border-gold-500 transition-colors duration-300 h-full flex flex-col">
                <div className="absolute -top-5 -left-5 bg-gold-500 w-10 h-10 flex items-center justify-center rounded">
                  <span className="text-black font-bold">3</span>
                </div>
                <div className="mb-6 text-gold-500">
                  <BsChatDots className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-4">Connect & Decide</h3>
                <p className="text-light-700 flex-grow">
                  Message your matches directly through our platform and find your perfect roommate match in NYC.
                </p>
                <div className="mt-6 pt-6 border-t border-light-300">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold-500"></div>
                    <span className="text-xs text-light-600">SECURE MESSAGING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/signup" className="btn-primary">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-light-100">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              FIND YOUR PERFECT MATCH
            </h2>
            <p className="text-xl text-light-600 max-w-3xl mx-auto">
              Our smart matching algorithm connects you with compatible roommates based on lifestyle, habits, and preferences. 
              Get started in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-white shadow-sm rounded-xl">
              <div className="feature-icon bg-gold-500/20">
                <BsGearFill className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-900">Smart Matching</h3>
              <p className="text-light-600">
                Our algorithm considers personality, habits, and lifestyle to find compatible roommates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card bg-white shadow-sm rounded-xl">
              <div className="feature-icon bg-teal-500/20">
                <BsShieldLockFill className="w-6 h-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-900">Verified Profiles</h3>
              <p className="text-light-600">
                Every profile is verified for safety and authenticity using our multi-step verification process.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card bg-white shadow-sm rounded-xl">
              <div className="feature-icon bg-gold-500/20">
                <BsChatDotsFill className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-900">Secure Communication</h3>
              <p className="text-light-600">
                Connect and communicate securely with potential roommates within our platform.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card bg-white shadow-sm rounded-xl">
              <div className="feature-icon bg-teal-500/20">
                <BsHouseFill className="w-6 h-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-900">Apartment Listings</h3>
              <p className="text-light-600">
                Browse available apartments and find the perfect home for you and your new roommate.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card bg-white shadow-sm rounded-xl">
              <div className="feature-icon bg-gold-500/20">
                <BsStarFill className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-900">Reviews & Ratings</h3>
              <p className="text-light-600">
                Read reviews from previous roommates to make informed decisions about potential matches.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card bg-white shadow-sm rounded-xl">
              <div className="feature-icon bg-teal-500/20">
                <BsMapFill className="w-6 h-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-900">Neighborhood Guides</h3>
              <p className="text-light-600">
                Explore different NYC neighborhoods and find the perfect area that matches your lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-light-50 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-teal-500/5"></div>
        
        <div className="container-responsive relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-heading mb-8">
              READY TO FIND YOUR ROOMMATE?
            </h2>
            <p className="text-xl text-light-700 mb-10">
              Join thousands of New Yorkers who have found their perfect roommate match with HeyRoomie.
            </p>
            <Link 
              href="/signup" 
              className="btn-primary text-lg px-10 py-4"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-light-200 border-t border-light-300">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-display uppercase text-light-900">HeyRoomie</h3>
              <p className="text-light-600 mt-2">
                Finding compatible roommates in NYC since 2023.
              </p>
            </div>
            
            <div className="flex gap-6">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/how-it-works" className="nav-link">How It Works</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-light-300 flex flex-col md:flex-row justify-between items-center">
            <p className="text-light-500 text-sm">
              &copy; {new Date().getFullYear()} HeyRoomie. All rights reserved.
            </p>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-light-500 hover:text-light-700 text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-light-500 hover:text-light-700 text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
