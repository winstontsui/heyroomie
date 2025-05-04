'use client';

import { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaMapMarkerAlt, FaBriefcase, FaBirthdayCake } from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';

interface MatchUser {
  id: string;
  name: string;
  age?: number;
  occupation?: string;
  neighborhood?: string;
  bio?: string;
  profilePicture?: string;
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

interface RoommateModalProps {
  match: MatchUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoommateModal({ match, isOpen, onClose }: RoommateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !match) return null;

  // Function to determine background color based on compatibility percentage
  const getCompatibilityColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Function to get profile picture URL
  const getProfilePictureUrl = (profilePicture?: string) => {
    if (!profilePicture || profilePicture === 'default') {
      return '/images/defaults/default-avatar.svg';
    }
    return `/api/profile-picture/${profilePicture}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Roommate Details</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content area with scrolling */}
        <div className="overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Profile picture and basic info */}
            <div className="md:w-1/3">
              <div className="aspect-square rounded-xl overflow-hidden border-4 border-gold-400 shadow-lg mb-4">
                <img 
                  src={getProfilePictureUrl(match.profilePicture)}
                  alt={`${match.name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/defaults/default-avatar.svg';
                  }}
                />
              </div>

              <div className="bg-light-50 rounded-xl p-4 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{match.name}</h3>
                
                {match.age && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaBirthdayCake className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{match.age} years old</span>
                  </div>
                )}
                
                {match.occupation && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaBriefcase className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{match.occupation}</span>
                  </div>
                )}
                
                {match.neighborhood && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{match.neighborhood}</span>
                  </div>
                )}

                <div className={`mt-4 inline-block px-3 py-1 rounded-full text-sm font-medium ${getCompatibilityColor(match.compatibility.overallPercentage)}`}>
                  {match.compatibility.overallPercentage}% Match
                </div>
              </div>

              <div className="mt-6">
                <button className="btn-primary w-full py-3 text-base">
                  Message {match.name.split(' ')[0]}
                </button>
              </div>
            </div>

            {/* Right column - Bio and compatibility details */}
            <div className="md:w-2/3">
              {/* Bio section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About {match.name.split(' ')[0]}</h3>
                {match.bio ? (
                  <p className="text-gray-600">{match.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio provided</p>
                )}
              </div>

              {/* Compatibility breakdown */}
              <div className="bg-light-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compatibility Breakdown</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Lifestyle</span>
                      <span className="text-sm font-medium text-gray-700">{match.compatibility.categories.lifestyle}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div 
                        className="h-2.5 bg-gold-500 rounded-full" 
                        style={{ width: `${match.compatibility.categories.lifestyle}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Location</span>
                      <span className="text-sm font-medium text-gray-700">{match.compatibility.categories.location}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div 
                        className="h-2.5 bg-gold-500 rounded-full" 
                        style={{ width: `${match.compatibility.categories.location}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Budget</span>
                      <span className="text-sm font-medium text-gray-700">{match.compatibility.categories.financial}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div 
                        className="h-2.5 bg-gold-500 rounded-full" 
                        style={{ width: `${match.compatibility.categories.financial}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Personal</span>
                      <span className="text-sm font-medium text-gray-700">{match.compatibility.categories.personality}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div 
                        className="h-2.5 bg-gold-500 rounded-full" 
                        style={{ width: `${match.compatibility.categories.personality}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Matching reasons */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Why You Match</h4>
                  <ul className="space-y-2">
                    {match.compatibility.matchingSummary.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <BsCheckCircleFill className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
