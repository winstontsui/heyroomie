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
  email: string; // Added email field (non-editable)
  bio: string;
  age: string;
  gender: string;
  occupation: string;
  neighborhood: string;
  profilePicture?: string;
  socialMedia: {
    instagram: string;
    linkedin: string;
  };
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
    email: user?.email || '',
    bio: '',
    age: '',
    gender: '',
    occupation: '',
    neighborhood: '',
    socialMedia: {
      instagram: '',
      linkedin: ''
    },
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
        setIsFirstTimeUser(true);
        setShowQuiz(true);
      }
    }
  }, [loading, formData, isNewUser]);
  
  // Monitor profile picture changes
  useEffect(() => {
    // Update UI when profile picture changes
  }, [formData.profilePicture]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/profile`);
      if (response.ok) {
        const data = await response.json();
        
        // Fill the form with existing data
        setFormData({
          name: data.name || '',
          email: user?.email || '',  // Set email from session
          bio: data.bio || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          occupation: data.occupation || '',
          neighborhood: data.neighborhood || '',
          profilePicture: data.profilePicture || 'default',
          socialMedia: {
            instagram: data.socialMedia?.instagram || '',
            linkedin: data.socialMedia?.linkedin || ''
          },
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
    
    console.log('Quiz completed with data:', profileData);
    
    // Make sure we're preserving the user's name from session
    const updatedProfileData = {
      ...profileData,
      // If profileData doesn't have a name, use the one from session
      name: profileData.name || user?.name || '',
      // Always include the email from the session
      email: user?.email || '',
    };
    
    // Update form data with the quiz responses
    setFormData(prev => ({
      ...prev,
      ...updatedProfileData,
    }));
    
    // Save the profile data directly
    const saveData = async () => {
      setSaving(true);
      try {
        console.log('Saving profile data:', updatedProfileData);
        
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProfileData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage({ type: 'success', text: 'Profile updated with your preferences!' });
          // Clear the 'new' parameter from the URL to avoid showing the quiz again on refresh
          if (isNewUser) {
            router.replace('/profile');
          }
          
          // Fetch the updated profile to make sure we have the latest data
          fetchUserProfile();
        } else {
          // Show specific validation errors if available
          if (data.validationErrors) {
            const errorMessages = Object.values(data.validationErrors).join(', ');
            setMessage({ type: 'error', text: errorMessages });
          } else {
            setMessage({ type: 'error', text: data.error || 'Failed to save preferences. Please try again.' });
          }
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

  // Reusable function to save profile data to the server
  const saveProfile = async (profileData: any) => {
    // Convert string values to numbers where needed
    const dataToSend = {
      ...profileData,
      // Explicitly include profilePicture to ensure it's not lost
      profilePicture: profileData.profilePicture || 'default',
      age: profileData.age ? parseInt(profileData.age) : undefined,
      budget: {
        min: profileData.budget.min ? parseInt(profileData.budget.min) : undefined,
        max: profileData.budget.max ? parseInt(profileData.budget.max) : undefined,
      },
      preferences: {
        ...profileData.preferences,
        cleanliness: profileData.preferences.cleanliness ? parseInt(profileData.preferences.cleanliness) : undefined,
      },
    };
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent | null, skipPrevent = false) => {
    if (e && !skipPrevent) {
      e.preventDefault();
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await saveProfile(formData);
      
      setSaving(false);
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Refresh user data to ensure we have the latest
        fetchUserProfile();
        
        // Clear success message after a delay
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          setMessage({ type: 'error', text: errorMessages });
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setSaving(false);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    }
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
                
                {/* Profile Picture - More Prominent */}
                <div className="mb-10 flex flex-col items-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gold-400 shadow-xl mb-4 group">
                    {/* Console logs moved to useEffect */}
                    <img 
                      src={formData.profilePicture ? `/api/profile-picture/${formData.profilePicture}` : `/api/profile-picture/default`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Error loading profile picture:', e);
                        // Fallback to default if the image fails to load
                        e.currentTarget.src = '/api/profile-picture/default';
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/jpeg, image/png, image/webp, image/gif';
                        fileInput.onchange = async (e) => {
                          const target = e.target as HTMLInputElement;
                          const file = target.files?.[0];
                          if (!file) return;
                          
                          // Create form data for API call
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          // Show uploading state
                          setMessage({ type: 'loading', text: 'Uploading profile picture...' });
                          
                          try {
                            // Call API to upload the image
                            const response = await fetch('/api/upload/profile-picture', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || 'Failed to upload image');
                            }
                            
                            const data = await response.json();
                            
                            // Update form data with new profile picture
                            setFormData(prev => ({
                              ...prev,
                              profilePicture: data.profilePicture
                            }));
                            
                            // No need to save the entire profile - the API already updated the profilePicture field
                            // Just update our local state
                            
                            setMessage({ type: 'success', text: 'Profile picture updated and saved!' });
                            
                            // Clear message after a delay
                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                            
                          } catch (error) {
                            console.error('Error uploading profile picture:', error);
                            setMessage({ type: 'error', text: 'Failed to upload profile picture. Please try again.' });
                          }
                        };
                        fileInput.click();
                      }}
                      className="absolute inset-0 bg-light-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity"
                    >
                      <div className="bg-gold-500 px-4 py-2 rounded-full shadow-md">
                        Change Photo
                      </div>
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-light-900">{formData.name}</h3>
                  <p className="text-light-600">{formData.occupation}</p>
                  <p className="text-sm text-light-500 mt-2">Profile photos help potential roommates recognize you</p>
                </div>
                
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
                    <label htmlFor="email" className="block text-sm font-medium text-light-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="input-field bg-light-100 cursor-not-allowed"
                      title="Email cannot be changed"
                    />
                    <p className="text-xs text-light-500 mt-1">Email address cannot be changed</p>
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
              
              {/* Social Media Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-light-900 border-b pb-2">Social Media</h2>
                <p className="text-sm text-light-600 mt-2 mb-4">Connect your social profiles to help potential roommates learn more about you</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-light-700 mb-1">
                      Instagram
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-light-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="socialMedia.instagram"
                        name="socialMedia.instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleTextChange}
                        className="input-field pl-10 focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                        placeholder="username (without @)"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="socialMedia.linkedin" className="block text-sm font-medium text-light-700 mb-1">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-light-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="socialMedia.linkedin"
                        name="socialMedia.linkedin"
                        value={formData.socialMedia.linkedin}
                        onChange={handleTextChange}
                        className="input-field pl-10 focus:ring-2 focus:ring-gold-300 border border-light-300 hover:border-gold-400 transition-colors"
                        placeholder="username or profile URL"
                      />
                    </div>
                  </div>
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
