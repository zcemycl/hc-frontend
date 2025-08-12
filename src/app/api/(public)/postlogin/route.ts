import { EXP_TOKEN_TIMEOUT } from "@/constants";
import { SiteMode, UserRoleEnum } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const mode = payload["mode"] as SiteMode;
  const email = payload["email"];
  const credentials = payload["credentials"];
  const expireAt = payload["expireAt"];
  const userId = payload["userId"];
  const role = payload["role"] as UserRoleEnum;
  const response = NextResponse.json(
    { message: "cache set in cookie" },
    { status: 200 },
  );
  response.cookies.set("mode", mode);
  response.cookies.set("email", email);
  response.cookies.set("credentials", credentials, {
    maxAge: EXP_TOKEN_TIMEOUT,
  });
  response.cookies.set("expireAt", expireAt);
  response.cookies.set("userId", userId);
  response.cookies.set("role", role);
  return response;
}
