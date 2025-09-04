import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { EXP_TOKEN_TIMEOUT } from "@/constants";

const openid_conf_uri = process.env.NEXT_PUBLIC_COGNITO_OPENID_CONF_URI;
const openid_conf = await (await fetch(openid_conf_uri as string)).json();
const JWKS = createRemoteJWKSet(new URL(openid_conf.jwks_uri as string));

export async function POST(request: Request) {
  const payloads = await request.json();
  const token = payloads["token"];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: openid_conf.issuer as string,
    });
    const username = payload.username;
    const response = NextResponse.json(payload, { status: 200 });
    console.log("validate endpt: ", payload);
    response.cookies.set("username", username as string);
    response.cookies.set("token", token, {
      maxAge: EXP_TOKEN_TIMEOUT,
    });
    return response;
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
