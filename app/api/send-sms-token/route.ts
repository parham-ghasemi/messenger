import { NextResponse } from 'next/server';
import sendTokenViaSms from '@/app/actions/sendTokenViaSms';

export async function POST(req: Request) {
  const body = await req.json();
  const { phoneNumber } = body;

  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    await sendTokenViaSms(phoneNumber);
    return NextResponse.json({ message: 'SMS sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}