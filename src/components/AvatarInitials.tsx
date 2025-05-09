'use client';
import React from 'react';

export default function AvatarInitials({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size / 2,
      }}
      className="flex items-center justify-center rounded-full bg-gold-500 text-white font-bold"
    >
      {initials}
    </div>
  );
}