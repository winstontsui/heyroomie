'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MatchUser {
  id: string;
  name: string;
  age?: number;
  occupation?: string;
  neighborhood?: string;
  bio?: string;
  compatibility: {
    overallPercentage: number;
    categories: {
      lifestyle: number;
      location: number;
      financial: number;
      personality: number;
    };
    matchingSummary: string[];
  };
}

export default function Matches() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [error, setError] = useState('');
  const [profileCompleted, setProfileCompleted] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Load matches on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchMatches();
    }
  }, [status]);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      const data = await response.json();

      if (response.ok) {
        if (data.completed) {
          setMatches(data.matches);
          setProfileCompleted(true);
        } else {
          setProfileCompleted(false);
        }
      } else {
        if (data.completed === false) {
          setProfileCompleted(false);
        } else {
          setError(data.error || 'Error fetching matches');
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to determine background color based on compatibility percentage
  const getCompatibilityColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container-responsive py-12 mt-20">
        <div className="text-center">
          <p className="text-lg">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (!profileCompleted) {
    return (
      <div className="container-responsive py-12 mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Complete Your Profile First</h1>
          <p className="text-lg text-secondary-600 mb-8">
            To see potential roommate matches, you need to complete your profile with your preferences.
          </p>
          <Link href="/profile" className="btn-primary px-6 py-3">
            Complete Profile
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-12 mt-20">
        <div className="bg-red-50 p-4 rounded-md text-red-800 max-w-3xl mx-auto">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 py-12 mt-20">
      <div className="container-responsive">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Your Roommate Matches</h1>
        <p className="text-lg text-secondary-600 mb-8">
          Based on your preferences, we've found {matches.length} potential roommates for you.
        </p>

        {matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No matches found yet</h2>
            <p className="text-secondary-600 mb-6">
              We couldn't find any matches based on your current preferences. Try adjusting your preferences or check back later as more users join.
            </p>
            <Link href="/profile" className="btn-primary px-6 py-3">
              Update Preferences
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-secondary-900">{match.name}</h2>
                      <div className="text-secondary-600 mt-1">
                        {match.age && <span>{match.age} years old</span>}
                        {match.age && match.occupation && <span> • </span>}
                        {match.occupation && <span>{match.occupation}</span>}
                      </div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-sm font-medium ${getCompatibilityColor(match.compatibility.overallPercentage)}`}>
                      {match.compatibility.overallPercentage}% Match
                    </div>
                  </div>

                  {match.neighborhood && (
                    <div className="mb-4">
                      <div className="flex items-center text-secondary-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{match.neighborhood}</span>
                      </div>
                    </div>
                  )}

                  {match.bio && (
                    <div className="mb-4">
                      <p className="text-secondary-700 text-sm line-clamp-3">{match.bio}</p>
                    </div>
                  )}

                  <div className="border-t border-secondary-200 pt-4 mt-4">
                    <h3 className="text-secondary-900 font-medium mb-2">Compatibility</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-xs text-secondary-500">Lifestyle</p>
                        <div className="h-2 w-full bg-secondary-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${match.compatibility.categories.lifestyle}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Location</p>
                        <div className="h-2 w-full bg-secondary-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${match.compatibility.categories.location}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Budget</p>
                        <div className="h-2 w-full bg-secondary-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${match.compatibility.categories.financial}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Personal</p>
                        <div className="h-2 w-full bg-secondary-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${match.compatibility.categories.personality}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {match.compatibility.matchingSummary.length > 0 && (
                      <div className="text-xs text-secondary-700">
                        <ul className="list-disc list-inside space-y-1">
                          {match.compatibility.matchingSummary.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <button className="btn-primary w-full">Message</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
