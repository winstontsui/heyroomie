'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiUpload, FiCamera } from 'react-icons/fi';

interface ProfilePictureUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  isOptional?: boolean;
}

export default function ProfilePictureUpload({ 
  onImageUploaded, 
  currentImage = 'default',
  isOptional = true 
}: ProfilePictureUploadProps) {
  // Use the static file for default, API endpoint for custom images
  const imageUrl = currentImage === 'default' ? 
    '/images/defaults/default-avatar.svg' : 
    `/api/profile-picture/${currentImage}`;
  
  const [image, setImage] = useState<string>(imageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Update the image URL when the currentImage prop changes
  useEffect(() => {
    const newImageUrl = currentImage === 'default' ? 
      '/images/defaults/default-avatar.svg' : 
      `/api/profile-picture/${currentImage}`;
    setImage(newImageUrl);
  }, [currentImage]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    const handleUpload = async (file: File) => {
      if (!file) return;
      
      try {
        setIsUploading(true);
        setError(null);
        
        // Process file upload
        
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);
        
        // Send the file to the server
        const response = await fetch('/api/upload/profile-picture', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Check if we got a profile picture ID back
        if (!data.profilePicture) {
          throw new Error('No profile picture ID returned from server');
        }
        
        // Set the image preview to the uploaded image URL using the new API endpoint
        const imageUrl = `/api/profile-picture/${data.profilePicture}`;
        setImage(imageUrl);
        
        // Call the callback function with the profile picture ID (not the URL)
        if (onImageUploaded) {
          // Pass the ID, not the URL, so the parent component can store it correctly
          onImageUploaded(data.profilePicture);
        }
      } catch (err: any) {
        console.error('Error uploading image:', err);
        setError(err.message || 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    };

    handleUpload(file);
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div 
        className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gold-300 cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handleImageClick}
      >
        {/* Image overlay during hover */}
        <div className="absolute inset-0 bg-light-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <FiCamera className="text-white text-3xl" />
        </div>
        
        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-light-900/70 flex items-center justify-center z-30">
            <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Profile image */}
        <div className="relative w-full h-full">
          <Image 
            src={image} 
            alt="Profile picture" 
            fill
            sizes="160px"
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <button 
        type="button" 
        onClick={handleImageClick}
        className="mt-4 px-4 py-2 flex items-center text-sm text-gold-700 hover:text-gold-800 transition-colors"
      >
        <FiUpload className="mr-2" />
        {isOptional ? 'Upload Photo (Optional)' : 'Upload Photo'}
      </button>
      
      {error && (
        <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
      )}
      
      <p className="mt-1 text-xs text-light-500 text-center">
        JPEG, PNG, WebP or GIF. Max 5MB.
      </p>
    </div>
  );
}
