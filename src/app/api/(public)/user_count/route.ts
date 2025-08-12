import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const myJson = await request.json();
  const count = myJson["count"];
  const response = NextResponse.json(
    { message: "cache set in cookie" },
    { status: 200 },
  );
  response.cookies.set("user-count", String(count), {
    maxAge: 60 * 60 * 24,
  });
  return response;
}
