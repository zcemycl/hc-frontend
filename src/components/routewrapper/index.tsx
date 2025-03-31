"use client";
import { useRouter } from "next/navigation";

export const ProtectedRoute = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  if (typeof window === "undefined") {
    console.log("window not mounted");
    return children;
  }
  // console.log("window mounted");
  const creds = JSON.parse(localStorage.getItem("credentials") as string);
  let isAuthenticated = false;
  if (!!creds) {
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
