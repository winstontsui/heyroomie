'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoommateModal from '@/components/matches/RoommateModal';
import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

interface MatchUser {
  id: string;
  name: string;
  email?: string;
  age?: number;
  occupation?: string;
  neighborhood?: string;
  bio?: string;
  profilePicture?: string;
  socialMedia?: {
    instagram?: string;
    linkedin?: string;
  };
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
  const [selectedMatch, setSelectedMatch] = useState<MatchUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Only show the top 5 matches
  const topMatches = matches.slice(0, 5);

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

  // Function to get profile picture URL
  const getProfilePictureUrl = (profilePicture?: string) => {
    if (!profilePicture || profilePicture === 'default') {
      return '/images/defaults/default-avatar.svg';
    }
    return `/api/profile-picture/${profilePicture}`;
  };

  // Open modal with selected match
  const openMatchDetails = (match: MatchUser) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-light-50 py-12 mt-20">
      <div className="container-responsive">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Roommate Matches</h1>
        <p className="text-lg text-gray-600 mb-8">
          Showing your top 5 matches.
        </p>

        {topMatches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No matches found yet</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any matches based on your current preferences. Try adjusting your preferences or check back later as more users join.
            </p>
            <Link href="/profile" className="btn-primary">
              Update Preferences
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMatches.length === 5 ? (
              <>
                {topMatches.slice(0, 3).map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => openMatchDetails(match)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={getProfilePictureUrl(match.profilePicture)}
                        alt={`${match.name}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/defaults/default-avatar.svg';
                        }}
                      />
                      <div className="absolute top-0 right-0 m-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(match.compatibility.overallPercentage)}`}>
                          {match.compatibility.overallPercentage}% Match
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{match.name}</h2>
                      
                      <div className="flex flex-col space-y-2 mb-4">
                        {match.age && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <span className="w-6 h-6 rounded-full bg-light-100 flex items-center justify-center mr-2">
                              <span className="text-xs font-medium">{match.age}</span>
                            </span>
                            <span>{match.age} years old</span>
                          </div>
                        )}

                        {match.occupation && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaBriefcase className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{match.occupation}</span>
                          </div>
                        )}

                        {match.neighborhood && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{match.neighborhood}</span>
                          </div>
                        )}
                      </div>

                      {match.bio && (
                        <div className="mb-4">
                          <p className="text-gray-700 text-sm line-clamp-2">{match.bio}</p>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex space-x-2">
                            <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-500 rounded-full" 
                                style={{ width: `${match.compatibility.categories.lifestyle}%` }}
                              ></div>
                            </div>
                            <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-500 rounded-full" 
                                style={{ width: `${match.compatibility.categories.location}%` }}
                              ></div>
                            </div>
                            <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-500 rounded-full" 
                                style={{ width: `${match.compatibility.categories.financial}%` }}
                              ></div>
                            </div>
                            <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-500 rounded-full" 
                                style={{ width: `${match.compatibility.categories.personality}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-span-3 flex justify-center gap-6">
                  {topMatches.slice(3).map((match) => (
                    <div
                      key={match.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-full max-w-md"
                      onClick={() => openMatchDetails(match)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={getProfilePictureUrl(match.profilePicture)}
                          alt={`${match.name}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/defaults/default-avatar.svg';
                          }}
                        />
                        <div className="absolute top-0 right-0 m-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(match.compatibility.overallPercentage)}`}>
                            {match.compatibility.overallPercentage}% Match
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{match.name}</h2>
                        
                        <div className="flex flex-col space-y-2 mb-4">
                          {match.age && (
                            <div className="flex items-center text-gray-600 text-sm">
                              <span className="w-6 h-6 rounded-full bg-light-100 flex items-center justify-center mr-2">
                                <span className="text-xs font-medium">{match.age}</span>
                              </span>
                              <span>{match.age} years old</span>
                            </div>
                          )}

                          {match.occupation && (
                            <div className="flex items-center text-gray-600 text-sm">
                              <FaBriefcase className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{match.occupation}</span>
                            </div>
                          )}

                          {match.neighborhood && (
                            <div className="flex items-center text-gray-600 text-sm">
                              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{match.neighborhood}</span>
                            </div>
                          )}
                        </div>

                        {match.bio && (
                          <div className="mb-4">
                            <p className="text-gray-700 text-sm line-clamp-2">{match.bio}</p>
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="flex justify-between mb-2">
                            <div className="flex space-x-2">
                              <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gold-500 rounded-full" 
                                  style={{ width: `${match.compatibility.categories.lifestyle}%` }}
                                ></div>
                              </div>
                              <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gold-500 rounded-full" 
                                  style={{ width: `${match.compatibility.categories.location}%` }}
                                ></div>
                              </div>
                              <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gold-500 rounded-full" 
                                  style={{ width: `${match.compatibility.categories.financial}%` }}
                                ></div>
                              </div>
                              <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gold-500 rounded-full" 
                                  style={{ width: `${match.compatibility.categories.personality}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">View Details</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              topMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => openMatchDetails(match)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getProfilePictureUrl(match.profilePicture)}
                      alt={`${match.name}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/defaults/default-avatar.svg';
                      }}
                    />
                    <div className="absolute top-0 right-0 m-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(match.compatibility.overallPercentage)}`}>
                        {match.compatibility.overallPercentage}% Match
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{match.name}</h2>
                    
                    <div className="flex flex-col space-y-2 mb-4">
                      {match.age && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="w-6 h-6 rounded-full bg-light-100 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{match.age}</span>
                          </span>
                          <span>{match.age} years old</span>
                        </div>
                      )}

                      {match.occupation && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <FaBriefcase className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{match.occupation}</span>
                        </div>
                      )}

                      {match.neighborhood && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{match.neighborhood}</span>
                        </div>
                      )}
                    </div>

                    {match.bio && (
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm line-clamp-2">{match.bio}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex space-x-2">
                          <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gold-500 rounded-full" 
                              style={{ width: `${match.compatibility.categories.lifestyle}%` }}
                            ></div>
                          </div>
                          <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gold-500 rounded-full" 
                              style={{ width: `${match.compatibility.categories.location}%` }}
                            ></div>
                          </div>
                          <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gold-500 rounded-full" 
                              style={{ width: `${match.compatibility.categories.financial}%` }}
                            ></div>
                          </div>
                          <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gold-500 rounded-full" 
                              style={{ width: `${match.compatibility.categories.personality}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">View Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Roommate Modal */}
        <RoommateModal 
          match={selectedMatch} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </div>
    </div>
  );
}
