import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/models/User';
import { readFile } from 'fs/promises';
import { join } from 'path';

// GET /api/profile-picture/[id] - Get a profile picture by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Handle default profile picture
    if (id === 'default') {
      try {
        // Try to read the static file first
        const staticFilePath = join(process.cwd(), 'public', 'images', 'defaults', 'default-avatar.svg');
        const fileData = await readFile(staticFilePath);
        
        return new NextResponse(fileData, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          },
        });
      } catch (error) {
        // Fallback to inline SVG if file read fails
        console.error('Error reading default avatar file:', error);
        
        // Generate a simple SVG avatar as a fallback
        const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
          <rect width="200" height="200" fill="#F3F4F6" />
          <circle cx="100" cy="70" r="40" fill="#D1D5DB" />
          <circle cx="100" cy="180" r="80" fill="#D1D5DB" />
        </svg>`;
        
        return new NextResponse(defaultSvg, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          },
        });
      }
    }
    
    await connectDB();
    
    // Find a user with this profile picture ID
    const user = await User.findOne({ profilePicture: id });
    
    if (!user || !user.profilePictureData) {
      // If no user found with this profile picture ID, return the default
      return NextResponse.redirect(new URL(`/api/profile-picture/default`, request.url));
    }
    
    // Get the image data and type
    const imageData = user.profilePictureData;
    const contentType = user.profilePictureType || 'image/png';
    
    // Convert base64 to binary
    const binaryData = Buffer.from(imageData, 'base64');
    
    // Return the image
    return new NextResponse(binaryData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Error serving profile picture:', error);
    
    // Generate a simple SVG avatar as a last resort fallback
    const emergencyFallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#F3F4F6" />
      <circle cx="100" cy="70" r="40" fill="#D1D5DB" />
      <circle cx="100" cy="180" r="80" fill="#D1D5DB" />
    </svg>`;
    
    return new NextResponse(emergencyFallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  }
}
