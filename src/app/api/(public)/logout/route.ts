import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookie = cookies();
  cookie.delete("token");
  cookie.delete("userId");
  cookie.delete("role");
  cookie.delete("username");

  return NextResponse.json({}, { status: 200 });
}
