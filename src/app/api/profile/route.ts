import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';

// GET /api/profile - Get user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without sensitive fields
    return NextResponse.json({
      name: user.name,
      bio: user.bio,
      age: user.age,
      gender: user.gender,
      occupation: user.occupation,
      neighborhood: user.neighborhood,
      budget: user.budget,
      preferences: user.preferences,
    });
  } catch (error: any) {
    console.error('Error getting profile:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching profile' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Update user profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if this is the first time completing the profile
    const isFirstCompletion = !user.bio && data.bio;

    // Validate required fields with user-friendly messages
    const validationErrors: { [key: string]: string } = {};
    
    // Basic profile validation
    if (!data.name) validationErrors.name = 'Please provide your name';
    if (!data.gender) validationErrors.gender = 'Please select your gender';
    if (!data.age || data.age < 18) validationErrors.age = 'Age must be at least 18';
    if (!data.neighborhood) validationErrors.neighborhood = 'Please select a neighborhood';
    
    // Preference validation
    if (!data.preferences?.sleepSchedule) validationErrors.sleepSchedule = 'Please select your sleep schedule';
    if (!data.preferences?.drinking) validationErrors.drinking = 'Please indicate your drinking preference';
    if (!data.preferences?.guests) validationErrors.guests = 'Please select your guest preference';
    if (!data.preferences?.noise) validationErrors.noise = 'Please select your noise preference';
    
    // Budget validation
    if (!data.budget?.min || !data.budget?.max) {
      validationErrors.budget = 'Please set your budget range';
    } else if (data.budget.min > data.budget.max) {
      validationErrors.budget = 'Minimum budget cannot be higher than maximum';
    }
    
    // Return validation errors if any
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { 
          error: 'Please fill in all required fields',
          validationErrors 
        },
        { status: 400 }
      );
    }

    // Update user fields
    user.name = data.name || user.name;
    user.bio = data.bio;
    user.age = data.age;
    user.gender = data.gender;
    user.occupation = data.occupation;
    user.neighborhood = data.neighborhood;

    // Update budget
    if (data.budget) {
      user.budget = {
        min: data.budget.min,
        max: data.budget.max,
      };
    }

    // Update preferences
    if (data.preferences) {
      user.preferences = {
        sleepSchedule: data.preferences.sleepSchedule,
        cleanliness: data.preferences.cleanliness,
        smoking: data.preferences.smoking,
        drinking: data.preferences.drinking,
        pets: data.preferences.pets,
        guests: data.preferences.guests,
        noise: data.preferences.noise,
      };
    }

    try {
      await user.save();
    } catch (saveError: any) {
      // If there's a Mongoose validation error, provide user-friendly messages
      if (saveError.name === 'ValidationError') {
        const validationErrors: { [key: string]: string } = {};
        
        // Transform Mongoose validation errors to user-friendly messages
        for (const field in saveError.errors) {
          // Handle enum validation errors with custom messages
          if (saveError.errors[field].kind === 'enum') {
            if (field === 'gender') {
              validationErrors[field] = 'Please select a valid gender option';
            } else if (field === 'preferences.sleepSchedule') {
              validationErrors.sleepSchedule = 'Please select a valid sleep schedule';
            } else if (field === 'preferences.drinking') {
              validationErrors.drinking = 'Please select a valid drinking preference';
            } else if (field === 'preferences.guests') {
              validationErrors.guests = 'Please select a valid guest preference';
            } else if (field === 'preferences.noise') {
              validationErrors.noise = 'Please select a valid noise preference';
            } else {
              validationErrors[field] = `Invalid selection for ${field.split('.').pop()}`;
            }
          } else {
            validationErrors[field] = saveError.errors[field].message;
          }
        }
        
        return NextResponse.json(
          { 
            error: 'Please check your information',
            validationErrors 
          },
          { status: 400 }
        );
      }
      
      // If it's another kind of error, rethrow
      throw saveError;
    }

    return NextResponse.json({
      success: true,
      isFirstCompletion,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
