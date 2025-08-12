"use client";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";

export const ProtectedRoute = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const { credentials, isLoadingAuth } = useAuth();
  if (typeof window === "undefined") {
    console.log("window not mounted");
    return children;
  }
  if (isLoadingAuth) {
    return children;
  }
  const creds = JSON.parse(credentials as string);
  let isAuthenticated = false;
  if (creds && "AccessToken" in creds) {
    isAuthenticated = true;
  }
  if (!isAuthenticated) {
    console.log("trigger redirect");
    router.push(
      process.env.NEXT_PUBLIC_ENV_NAME !== "local-dev" ? "/login" : "/",
    );
  }
  return children;
};
