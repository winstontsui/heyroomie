import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import Match from '@/models/Match';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const { matchedUserId } = await req.json();
  const user = await User.findOne({ email: session.user.email });
  if (!user || !matchedUserId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  // Prevent duplicate matches
  const existing = await Match.findOne({ user: user._id, matchedUser: matchedUserId });
  if (existing) {
    return NextResponse.json({ success: true, alreadyMatched: true });
  }
  await Match.create({ user: user._id, matchedUser: matchedUserId });
  return NextResponse.json({ success: true });
}