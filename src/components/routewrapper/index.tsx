"use client";
import { useAuth, useLoader } from "@/contexts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const { credentials, isLoadingAuth } = useAuth();
  const { isLoadingv2 } = useLoader();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoadingv2) return;

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
  }, [credentials, isLoadingv2, router]);

  // useEffect(() => {
  //   console.log("protect", isLoadingAuth, isAuthenticated);
  //   if (!isLoadingAuth && isAuthenticated) {
  //     setIsLoading(false);
  //   }
  // }, [isLoadingAuth, isAuthenticated]);

  if (isLoadingv2) {
    return children; // Or maybe a loading spinner
  }

  return isAuthenticated ? children : null;
};
