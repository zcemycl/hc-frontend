import { SiteMode } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const mode = payload["mode"] as SiteMode;
  const email = payload["email"];
  const cognito_user = payload["cognito_user"];
  const response = NextResponse.json(
    { message: "cache set in cookie" },
    { status: 200 },
  );
  response.cookies.set("mode", mode);
  response.cookies.set("email", email);
  response.cookies.set("cognito_user", cognito_user);
  return response;
}
