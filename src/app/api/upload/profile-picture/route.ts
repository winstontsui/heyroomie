import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import User from '@/models/User';
import connectDB from '@/lib/db/mongoose';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Convert the file to a Base64 string for storage in MongoDB
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    
    // Connect to the database
    await connectDB();
    
    // Generate a unique ID for the profile picture
    const pictureId = uuidv4();
    
    // Get the current user to check if they have an existing profile picture
    const currentUser = await User.findOne({ email: session.user.email });
    
    // Update with the new profile picture data
    
    // Update the user with the new profile picture data
    const updateResult = await User.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          profilePicture: pictureId,
          profilePictureData: base64Data,
          profilePictureType: file.type 
        } 
      }
    );
    
    // Double-check that the update was successful
    const verifyUser = await User.findOne({ email: session.user.email });
    
    if (!verifyUser || verifyUser.profilePicture !== pictureId) {
      console.error('Profile picture update failed or not verified!');
    }
    
    return NextResponse.json({ 
      success: true, 
      profilePicture: pictureId 
    });
    
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}
