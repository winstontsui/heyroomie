'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BsCheckCircleFill } from 'react-icons/bs';

// Extended NextAuth session user type
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileFormData {
  name: string;
  bio: string;
  age: string;
  gender: string;
  occupation: string;
  neighborhood: string;
  budget: {
    min: string;
    max: string;
  };
  preferences: {
    sleepSchedule: string;
    cleanliness: string;
    smoking: boolean;
    drinking: string;
    pets: boolean;
    guests: string;
    noise: string;
  };
}

function ProfileContent() {
  const { data: session, status } = useSession();
  // Cast session user to extended type if needed
  const user = session?.user as ExtendedUser | undefined;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get('new') === 'true';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showQuiz, setShowQuiz] = useState(isNewUser);

  // Initialize form data
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    age: '',
    gender: '',
    occupation: '',
    neighborhood: '',
    budget: {
      min: '',
      max: '',
    },
    preferences: {
      sleepSchedule: '',
      cleanliness: '3',
      smoking: false,
      drinking: '',
      pets: false,
      guests: '',
      noise: '',
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Load user profile data on mount
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchUserProfile();
    }
  }, [status, session]);
  
  // Check if this is the user's first time and show quiz if needed
  useEffect(() => {
    // Only run this check once the profile data has been loaded
    if (!loading) {
      // Check if the profile is essentially empty
      const isProfileEmpty = !formData.name && 
                            !formData.bio && 
                            !formData.neighborhood && 
                            !formData.budget.min && 
                            !formData.budget.max && 
                            !formData.preferences.sleepSchedule;
      
      if (isProfileEmpty && !isNewUser) {
        console.log("First time user detected, showing quiz");
        setIsFirstTimeUser(true);
        setShowQuiz(true);
      }
    }
  }, [loading, formData, isNewUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/profile`);
      if (response.ok) {
        const data = await response.json();
        // Fill the form with existing data
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          occupation: data.occupation || '',
          neighborhood: data.neighborhood || '',
          budget: {
            min: data.budget?.min?.toString() || '',
            max: data.budget?.max?.toString() || '',
          },
          preferences: {
            sleepSchedule: data.preferences?.sleepSchedule || '',
            cleanliness: data.preferences?.cleanliness?.toString() || '3',
            smoking: data.preferences?.smoking || false,
            drinking: data.preferences?.drinking || '',
            pets: data.preferences?.pets || false,
            guests: data.preferences?.guests || '',
            noise: data.preferences?.noise || '',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (profileData: any) => {
    setShowQuiz(false);
    setIsFirstTimeUser(false);
    
    // Update form data with the quiz responses
    setFormData(prev => ({
      ...prev,
      ...profileData,
    }));
    
    // Save the profile data directly
    const saveData = async () => {
      setSaving(true);
      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage({ type: 'success', text: 'Profile updated with your preferences!' });
          // Clear the 'new' parameter from the URL to avoid showing the quiz again on refresh
          if (isNewUser) {
            router.replace('/profile');
          }
        } else {
          // Show specific validation errors if available
          if (data.validationErrors) {
            const errorMessages = Object.values(data.validationErrors).join(', ');
            setMessage({ type: 'error', text: errorMessages });
          } else {
            setMessage({ type: 'error', text: data.error || 'Failed to save preferences. Please try again.' });
          }
          console.error('Profile save errors:', data);
        }
      } catch (error) {
        console.error('Error saving profile:', error);
        setMessage({ type: 'error', text: 'An error occurred while saving preferences.' });
      } finally {
        setSaving(false);
        
        // Scroll to top to show the success message
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };
    
    saveData();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentKey = parent as keyof ProfileFormData;
        const parentValue = prev[parentKey];
        
        if (parentValue && typeof parentValue === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties
      const [parent, child] = name.split('.');
      setFormData(prev => {
        // Type safe way to handle nested properties
        const parentKey = parent as keyof ProfileFormData;
        const parentValue = prev[parentKey];
        
        // Ensure we're only spreading objects
        if (parentValue && typeof parentValue === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: checked
            }
          };
        }
        return prev;
      });
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent | null, skipPrevent = false) => {
    if (e && !skipPrevent) {
      e.preventDefault();
    }

    // Convert string values to numbers where needed
    const dataToSend = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      budget: {
        min: formData.budget.min ? parseInt(formData.budget.min) : undefined,
        max: formData.budget.max ? parseInt(formData.budget.max) : undefined,
      },
      preferences: {
        ...formData.preferences,
        cleanliness: formData.preferences.cleanliness ? parseInt(formData.preferences.cleanliness) : undefined,
      }
    };
    
    setSaving(true);
    
    fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
    .then(response => response.json())
    .then(data => {
      setSaving(false);
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update the URL if this was a new user that just finished setting up their profile
        if (isNewUser) {
          router.replace('/profile');
        }
      } else {
        // Show specific validation errors if available
        if (data.validationErrors) {
          const errorMessages = Object.values(data.validationErrors).join(', ');
          setMessage({ type: 'error', text: errorMessages });
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        }
      }
      
      // Clear success message after a delay
      if (data.success) {
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    })
    .catch(error => {
      console.error('Error saving profile:', error);
      setSaving(false);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container-responsive py-8 mt-20">
        <div className="text-center">
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Show quiz for first-time users
  if (showQuiz) {
    const PreferenceQuiz = dynamic(() => import('@/components/onboarding/PreferenceQuiz'), {
      loading: () => <p className="text-center py-8">Loading quiz...</p>,
    });
    
    return <PreferenceQuiz onComplete={handleQuizComplete} />;
  }

  return (
    <div className="bg-light-50 py-8 mt-20">
      <div className="container-responsive">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-light-900">Your Profile</h1>
            
            <button
              onClick={() => handleSubmit(null, true)}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                <>Save</>  
              )}
            </button>
          </div>
          
          {message.text && (
            <div 
              className={`mb-6 p-4 rounded-md flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
            >
              {message.type === 'success' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              )}
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <form onSubmit={(e) => handleSubmit(e)} className="p-6 space-y-8">
              {/* Form edit instructions */}
              <div className="bg-light-100 p-4 rounded-md mb-6 flex items-center">
                <svg className="w-5 h-5 text-light-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm text-light-700">Click on any field to edit. Your changes will be saved when you click the <strong>Save</strong> button at the top of the page.</p>
              </div>
              
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-light-900 border-b pb-2">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-light-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-light-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      min="18"
                      max="120"
                      value={formData.age}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                      placeholder="Your age"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-light-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors cursor-pointer"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-light-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                      placeholder="Your job title"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-light-700 mb-1">
                    Bio (Tell potential roommates about yourself)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleTextChange}
                    className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                    placeholder="Tell potential roommates about your lifestyle, interests, and habits..."
                    maxLength={500}
                  />
                  <p className="text-xs text-light-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
              
              {/* User Location */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-light-900 border-b pb-2">Location</h2>
                <div className="mt-4">
                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-light-700 mb-1">
                      Preferred Neighborhood
                    </label>
                    <select
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors cursor-pointer"
                    >
                      <option value="">Select neighborhood</option>
                      <option value="Manhattan - West Village">Manhattan - West Village</option>
                      <option value="Manhattan - Lower East Side">Manhattan - Lower East Side</option>
                      <option value="Manhattan - Financial District">Manhattan - Financial District</option>
                      <option value="Brooklyn - Williamsburg">Brooklyn - Williamsburg</option>
                      <option value="Brooklyn - Park Slope">Brooklyn - Park Slope</option>
                      <option value="Brooklyn - Bushwick">Brooklyn - Bushwick</option>
                      <option value="Brooklyn - Dumbo">Brooklyn - Dumbo</option>
                      <option value="Brooklyn - Brooklyn Heights">Brooklyn - Brooklyn Heights</option>
                      <option value="Queens - Astoria">Queens - Astoria</option>
                      <option value="Queens - Long Island City">Queens - Long Island City</option>
                      <option value="Queens - Jackson Heights">Queens - Jackson Heights</option>
                      <option value="Bronx - Riverdale">Bronx - Riverdale</option>
                      <option value="Staten Island">Staten Island</option>
                    </select>
                  </div>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="budget.min" className="block text-sm font-medium text-light-700 mb-1">
                        Minimum Budget ($ per month)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-500">$</span>
                        <input
                          type="number"
                          id="budget.min"
                          name="budget.min"
                          min="0"
                          step="50"
                          value={formData.budget.min}
                          onChange={handleTextChange}
                          className="input-field pl-7 focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                          placeholder="Minimum"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="budget.max" className="block text-sm font-medium text-light-700 mb-1">
                        Maximum Budget ($ per month)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-500">$</span>
                        <input
                          type="number"
                          id="budget.max"
                          name="budget.max"
                          min="0"
                          step="50"
                          value={formData.budget.max}
                          onChange={handleTextChange}
                          className="input-field pl-7 focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                          placeholder="Maximum"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Roommate Preferences Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-light-900 border-b pb-2">Roommate Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferences.sleepSchedule" className="block text-sm font-medium text-light-700 mb-1">
                      Sleep Schedule
                    </label>
                    <select
                      id="preferences.sleepSchedule"
                      name="preferences.sleepSchedule"
                      value={formData.preferences.sleepSchedule}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors cursor-pointer"
                    >
                      <option value="">Select sleep schedule</option>
                      <option value="early_bird">Early Bird (Early to bed, early to rise)</option>
                      <option value="night_owl">Night Owl (Late to bed, late to rise)</option>
                      <option value="flexible">Flexible (Adaptable schedule)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.cleanliness" className="block text-sm font-medium text-light-700 mb-1">
                      Cleanliness Level (1-5)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        id="preferences.cleanliness"
                        name="preferences.cleanliness"
                        min="1"
                        max="5"
                        value={formData.preferences.cleanliness}
                        onChange={handleTextChange}
                        className="w-full cursor-pointer focus:ring-2 focus:ring-gold-300"
                      />
                      <span className="ml-2 w-6 text-center">{formData.preferences.cleanliness}</span>
                    </div>
                    <div className="flex justify-between text-xs text-light-500 mt-1">
                      <span>Relaxed</span>
                      <span>Very Neat</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preferences.smoking"
                      name="preferences.smoking"
                      checked={formData.preferences.smoking}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-gold-500 rounded cursor-pointer focus:ring-2 focus:ring-gold-300"
                    />
                    <label htmlFor="preferences.smoking" className="ml-2 block text-sm text-light-700">
                      I'm okay with smoking
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.drinking" className="block text-sm font-medium text-light-700 mb-1">
                      Drinking Preference
                    </label>
                    <select
                      id="preferences.drinking"
                      name="preferences.drinking"
                      value={formData.preferences.drinking}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors cursor-pointer"
                    >
                      <option value="">Select drinking preference</option>
                      <option value="never">Never</option>
                      <option value="occasionally">Occasionally</option>
                      <option value="frequently">Frequently</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preferences.pets"
                      name="preferences.pets"
                      checked={formData.preferences.pets}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-gold-500 rounded cursor-pointer focus:ring-2 focus:ring-gold-300"
                    />
                    <label htmlFor="preferences.pets" className="ml-2 block text-sm text-light-700">
                      I'm okay with pets
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.guests" className="block text-sm font-medium text-light-700 mb-1">
                      Guest Preference
                    </label>
                    <select
                      id="preferences.guests"
                      name="preferences.guests"
                      value={formData.preferences.guests}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors cursor-pointer"
                    >
                      <option value="">Select guest preference</option>
                      <option value="rarely">Rarely (Few or no guests)</option>
                      <option value="occasionally">Occasionally (Sometimes have guests over)</option>
                      <option value="frequently">Frequently (Often have friends over)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.noise" className="block text-sm font-medium text-light-700 mb-1">
                      Noise Preference
                    </label>
                    <select
                      id="preferences.noise"
                      name="preferences.noise"
                      value={formData.preferences.noise}
                      onChange={handleTextChange}
                      className="input-field focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors cursor-pointer"
                    >
                      <option value="">Select noise preference</option>
                      <option value="quiet">Quiet (Prefer a peaceful environment)</option>
                      <option value="moderate">Moderate (Some noise is okay)</option>
                      <option value="loud">Energetic (Don't mind noise/music)</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
