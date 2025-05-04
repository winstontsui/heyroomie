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

    await user.save();

    return NextResponse.json({
      success: true,
      isFirstCompletion,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
}
