import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';

// GET /api/debug - Debug endpoint to check user data directly
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

    // Get the raw user document directly from MongoDB
    const user = await User.findOne({ email: session.user.email }).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Raw user document from database:', user);
    // Use optional chaining to avoid TypeScript errors
    // Use type assertion to avoid TypeScript errors
    const typedUser = user as any;
    console.log('Profile picture field in database:', typedUser.profilePicture);

    // Return the raw user data for debugging
    return NextResponse.json({
      message: 'Debug information',
      user: user
    });
  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
