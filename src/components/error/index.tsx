"use client";

import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-100">
      <h1 className="text-xl font-bold text-red-600">Unexpected error</h1>
      <p className="text-gray-700">{error.message}</p>
      <ol className="list-decimal list-inside text-gray-800 space-y-2">
        <li>Contact the website admin</li>
        <li>
          <button
            onClick={() => resetErrorBoundary()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              document.cookie.split(";").forEach((c) => {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    "=;expires=" + new Date().toUTCString() + ";path=/",
                  );
              });
              router.refresh();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear Cookies
          </button>
        </li>
        <li>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Home Page
          </button>
        </li>
      </ol>
    </div>
  );
}

export function ClientErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // You can choose to reset navigation or reload
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
