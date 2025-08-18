import { NextResponse } from "next/server";
import jwkToPem from "jwk-to-pem";
import { createRemoteJWKSet, importSPKI, jwtVerify } from "jose";

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
    return NextResponse.json(payload, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
