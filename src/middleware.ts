import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, importSPKI } from "jose";
import jwkToPem from "jwk-to-pem";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const openid_conf_uri = process.env.NEXT_PUBLIC_COGNITO_OPENID_CONF_URI;
console.log(openid_conf_uri);

export async function middleware(request: NextRequest) {
  const cookie = cookies();
  let authorization;
  if (cookie.has("token")) {
    const token = cookie.get("token")?.value;
    authorization = `Bearer ${token}`;
  } else {
    authorization = request.headers.get("Authorization") as string;
  }

  // validate bearer
  const [token_type, token] = authorization.split(" ");
  if (token_type !== "Bearer") {
    return Response.json(
      {
        success: false,
        message: "authentication failed -- unsupported token type",
      },
      { status: 401 },
    );
  }
  // validate jwk
  const [headerEncoded] = token.split(".");
  const buff = Buffer.from(headerEncoded, "base64");
  const text = buff.toString("ascii");
  const kid = JSON.parse(text);
  const openid_conf = await (await fetch(openid_conf_uri as string)).json();
  const jwks = await (await fetch(openid_conf.jwks_uri as string)).json();
  const jwk = jwks.keys.filter((data: any) => data.kid === kid.kid);
  if (jwk.length === 0) {
    return Response.json(
      {
        success: false,
        message: "authentication failed -- unsupported jwk.",
      },
      { status: 401 },
    );
  }
  const pem = jwkToPem(jwk[0]);
  const publicKey = await importSPKI(pem, jwk[0].alg);
  let resjwk;
  try {
    resjwk = await jwtVerify(token, publicKey, {
      issuer: openid_conf.issuer,
    });
  } catch (e) {
    console.log("error: ", e);
    // const url = request.nextUrl.clone();
    // url.pathname = "/logout";
    // return NextResponse.redirect(url);
    return Response.json(
      {
        success: false,
        message: `authentication failed -- ${e}.`,
      },
      { status: 401 },
    );
  }

  // modify headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Identity", JSON.stringify(resjwk.payload));
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/private/:path*"],
};
