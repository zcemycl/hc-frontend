import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookie = cookies();
  const identity = JSON.parse(request.headers.get("Identity") as string);
  const authorization = request.headers.get("Authorization") as string;
  const [_, token] = authorization.split(" ");
  console.log(token);
  console.log(identity);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  cookie.set("token", token);

  return NextResponse.json(
    {
      id,
      username: identity && "username" in identity ? identity.username : "fake",
      role: identity && "role" in identity ? identity.role : "User",
    },
    { status: 200 },
  );
}
