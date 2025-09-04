import { FASTAPI_URI } from "@/http/backend/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookies = request.cookies;
  if (cookies.has("drug-count")) {
    return NextResponse.json(
      { count: Number(cookies.get("drug-count")?.value) },
      { status: 200 },
    );
  }
  const API_URI = `${FASTAPI_URI}/get_fdalabel_count`;
  const resp = await fetch(API_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const count = await resp.json();
  const response = NextResponse.json({ count }, { status: 200 });
  response.cookies.set("drug-count", String(count), {
    maxAge: 60,
  });
  return response;
}

export async function POST(request: NextRequest) {
  const myJson = await request.json();
  const count = myJson["count"];
  const response = NextResponse.json(
    { message: "cache set in cookie" },
    { status: 200 },
  );
  response.cookies.set("drug-count", String(count), {
    maxAge: 60 * 60,
  });
  return response;
}
