"use client";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const { credentials, isLoadingAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoadingAuth) return;

    let authenticated = false;
    try {
      const creds = credentials ? JSON.parse(credentials as string) : null;
      if (creds && "AccessToken" in creds) {
        authenticated = true;
      }
    } catch {
      authenticated = false;
    }

    setIsAuthenticated(authenticated);

    if (!authenticated) {
      console.log("trigger redirect");
      router.push(
        process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
      );
    }
  }, [credentials, isLoadingAuth, router]);

  if (isLoadingAuth) {
    return children; // Or maybe a loading spinner
  }

  return isAuthenticated ? children : null;
};
