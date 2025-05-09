// src/app/api/matches/unmatch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import Match from '@/models/Match';
import dbConnect from '@/lib/db/mongoose';

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { matchedUserId } = await req.json();
  const userId = session.user.id;

  await Match.findOneAndDelete({ user: userId, matchedUser: matchedUserId });
  return NextResponse.json({ success: true });
}