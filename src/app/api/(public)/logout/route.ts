import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookie = cookies();
  cookie.delete("token");
  cookie.delete("userId");
  cookie.delete("role");
  cookie.delete("username");
  cookie.delete("credentials");
  cookie.delete("email");
  cookie.delete("cognito_user");
  cookie.delete("expireAt");

  return NextResponse.json({}, { status: 200 });
}
