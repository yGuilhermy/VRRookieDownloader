import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:4000/api/games/${params.id}`);
  const data = await res.json();
  return NextResponse.json(data);
}
