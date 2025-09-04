import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EXP_TOKEN_TIMEOUT } from "@/constants";

export async function GET(request: Request) {
  const cookie = cookies();
  const identity = JSON.parse(request.headers.get("Identity") as string);
  const authorization = request.headers.get("Authorization") as string;
  const [_, token] = authorization.split(" ");
  console.log("identity: ", identity);
  const username =
    identity && "username" in identity ? identity.username : "fake";
  const role = identity && "role" in identity ? identity.role : "User";
  cookie.set("token", token, {
    maxAge: EXP_TOKEN_TIMEOUT,
  });
  cookie.set("username", username);
  // cookie.set("role", role);

  return NextResponse.json(
    {
      // id,
      username: username,
      role: role,
    },
    { status: 200 },
  );
}
