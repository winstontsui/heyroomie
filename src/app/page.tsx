import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary-50 min-h-screen">
        <div className="container-responsive py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Find Your Perfect <span className="text-primary-600">Roommate</span> in NYC
            </h1>
            <p className="text-xl text-secondary-700 mb-8">
              HeyRoomie matches young professionals in NYC based on lifestyle preferences and compatibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn-primary text-center">
                Get Started
              </Link>
              <Link href="/login" className="btn-secondary text-center">
                Login
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-96 w-full">
            <div className="w-full h-full rounded-xl bg-primary-200 flex items-center justify-center">
              <p className="text-primary-700 font-semibold">Roommate Matching Made Easy</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-secondary-600">
                Sign up and tell us about yourself, your preferences, and what you're looking for in a roommate.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="card">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-secondary-600">
                Our algorithm finds compatible roommates based on your living style and preferences.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="card">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Decide</h3>
              <p className="text-secondary-600">
                Message your matches, get to know them, and find your perfect roommate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container-responsive">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose HeyRoomie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
                <p className="text-secondary-600">
                  Our algorithm considers your lifestyle preferences to find truly compatible roommates.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-secondary-600">
                  Your data is protected, and you control who can see your profile information.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Built-in Messaging</h3>
                <p className="text-secondary-600">
                  Communicate directly with potential roommates through our platform.
                </p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="flex items-start">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">NYC Neighborhoods</h3>
                <p className="text-secondary-600">
                  Specify your preferred NYC neighborhoods to find roommates in the right area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-responsive text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your perfect roommate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join HeyRoomie today and get matched with compatible roommates in NYC.
          </p>
          <Link href="/signup" className="bg-white text-primary-600 px-6 py-3 rounded-md font-semibold hover:bg-primary-50 transition-colors duration-200">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HeyRoomie</h3>
              <p className="text-secondary-300">
                The smart way to find roommates in NYC.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-secondary-300 hover:text-white">Home</Link></li>
                <li><Link href="/about" className="text-secondary-300 hover:text-white">About</Link></li>
                <li><Link href="/how-it-works" className="text-secondary-300 hover:text-white">How It Works</Link></li>
                <li><Link href="/contact" className="text-secondary-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-secondary-300 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-secondary-300 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-secondary-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-secondary-300 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-secondary-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-secondary-800 text-center text-secondary-400">
            <p>&copy; {new Date().getFullYear()} HeyRoomie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
