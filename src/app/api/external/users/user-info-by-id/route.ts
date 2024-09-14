import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookie = cookies();
  if (!cookie.has("token")) {
    return NextResponse.json(
      {
        message: "Not authenticated",
      },
      { status: 401 },
    );
  }
  const token = cookie.get("token")!.value;
  console.log(token);
  return NextResponse.json(
    {
      token,
    },
    { status: 200 },
  );
}
