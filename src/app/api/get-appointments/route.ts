import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // This is a placeholder.
  // Later, we will fetch real data from your database here.
  const dummyData = {
    pending: [],
    confirmed: [],
  };

  return NextResponse.json(dummyData);
}
