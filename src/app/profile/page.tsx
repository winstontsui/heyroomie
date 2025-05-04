'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

export default function Profile() {
  const { data: session, status } = useSession();
  // Cast session user to extended type if needed
  const user = session?.user as ExtendedUser | undefined;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        const parentObj = prev[parent as keyof ProfileFormData];
        if (typeof parentObj === 'object' && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        const parentObj = prev[parent as keyof ProfileFormData];
        if (typeof parentObj === 'object' && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: checked,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert string values to numbers where appropriate
      // Process the form data to convert strings to numbers where needed
      const processedData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        budget: {
          min: formData.budget.min ? parseInt(formData.budget.min) : undefined,
          max: formData.budget.max ? parseInt(formData.budget.max) : undefined,
        },
        preferences: {
          ...formData.preferences,
          cleanliness: formData.preferences.cleanliness ? parseInt(formData.preferences.cleanliness) : 3,
        },
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile saved successfully!' });
        // If this is first time completing profile, go to matches
        if (data.isFirstCompletion) {
          router.push('/matches');
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Error saving profile' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setSaving(false);
      
      // Clear success message after a delay
      if (message.type === 'success') {
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
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

  return (
    <div className="bg-secondary-50 py-8 mt-20">
      <div className="container-responsive">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-secondary-900 mb-6">Your Profile</h1>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-secondary-900 border-b pb-2">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleTextChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-secondary-700 mb-1">
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
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-secondary-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleTextChange}
                      className="input-field"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-secondary-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleTextChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-secondary-700 mb-1">
                    Bio (Tell potential roommates about yourself)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleTextChange}
                    className="input-field"
                    maxLength={500}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
              
              {/* Location & Budget Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-secondary-900 border-b pb-2">Location & Budget</h2>
                
                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-secondary-700 mb-1">
                    Preferred NYC Neighborhood
                  </label>
                  <select
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleTextChange}
                    className="input-field"
                  >
                    <option value="">Select neighborhood</option>
                    <option value="Manhattan - Upper East Side">Manhattan - Upper East Side</option>
                    <option value="Manhattan - Upper West Side">Manhattan - Upper West Side</option>
                    <option value="Manhattan - Midtown">Manhattan - Midtown</option>
                    <option value="Manhattan - Chelsea">Manhattan - Chelsea</option>
                    <option value="Manhattan - East Village">Manhattan - East Village</option>
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
                    <label htmlFor="budget.min" className="block text-sm font-medium text-secondary-700 mb-1">
                      Minimum Budget ($ per month)
                    </label>
                    <input
                      type="number"
                      id="budget.min"
                      name="budget.min"
                      min="0"
                      step="50"
                      value={formData.budget.min}
                      onChange={handleTextChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="budget.max" className="block text-sm font-medium text-secondary-700 mb-1">
                      Maximum Budget ($ per month)
                    </label>
                    <input
                      type="number"
                      id="budget.max"
                      name="budget.max"
                      min="0"
                      step="50"
                      value={formData.budget.max}
                      onChange={handleTextChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              
              {/* Living Preferences Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-secondary-900 border-b pb-2">Living Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferences.sleepSchedule" className="block text-sm font-medium text-secondary-700 mb-1">
                      Sleep Schedule
                    </label>
                    <select
                      id="preferences.sleepSchedule"
                      name="preferences.sleepSchedule"
                      value={formData.preferences.sleepSchedule}
                      onChange={handleTextChange}
                      className="input-field"
                    >
                      <option value="">Select sleep schedule</option>
                      <option value="early_bird">Early Bird (Early to bed, early to rise)</option>
                      <option value="night_owl">Night Owl (Late to bed, late to rise)</option>
                      <option value="flexible">Flexible (Adaptable schedule)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.cleanliness" className="block text-sm font-medium text-secondary-700 mb-1">
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
                        className="w-full"
                      />
                      <span className="ml-2 w-6 text-center">{formData.preferences.cleanliness}</span>
                    </div>
                    <div className="flex justify-between text-xs text-secondary-500 mt-1">
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
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <label htmlFor="preferences.smoking" className="ml-2 block text-sm text-secondary-700">
                      I'm okay with smoking
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.drinking" className="block text-sm font-medium text-secondary-700 mb-1">
                      Drinking Preference
                    </label>
                    <select
                      id="preferences.drinking"
                      name="preferences.drinking"
                      value={formData.preferences.drinking}
                      onChange={handleTextChange}
                      className="input-field"
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
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <label htmlFor="preferences.pets" className="ml-2 block text-sm text-secondary-700">
                      I'm okay with pets
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.guests" className="block text-sm font-medium text-secondary-700 mb-1">
                      Guest Preference
                    </label>
                    <select
                      id="preferences.guests"
                      name="preferences.guests"
                      value={formData.preferences.guests}
                      onChange={handleTextChange}
                      className="input-field"
                    >
                      <option value="">Select guest preference</option>
                      <option value="rarely">Rarely (Few or no guests)</option>
                      <option value="occasionally">Occasionally (Sometimes have guests over)</option>
                      <option value="frequently">Frequently (Often have friends over)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="preferences.noise" className="block text-sm font-medium text-secondary-700 mb-1">
                      Noise Preference
                    </label>
                    <select
                      id="preferences.noise"
                      name="preferences.noise"
                      value={formData.preferences.noise}
                      onChange={handleTextChange}
                      className="input-field"
                    >
                      <option value="">Select noise preference</option>
                      <option value="quiet">Quiet (Prefer a peaceful environment)</option>
                      <option value="moderate">Moderate (Some noise is okay)</option>
                      <option value="loud">Energetic (Don't mind noise/music)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-6 py-3 w-full md:w-auto"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
