import { NavBar, Footer, SideBar, ClientErrorBoundary } from "@/components";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import {
  AuthProvider,
  OpenBarProvider,
  LoaderProvider,
  FdaVersionsProvider,
  TableSelectProvider,
} from "@/contexts";
import { setupAuthHook, setupScrapeVersionsHook } from "@/http/utils-server";
export { metadata } from "@/metadata";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    hasCreds,
    defaultCredentials,
    hasUsername,
    defaultUsername,
    hasRole,
    defaultRole,
    hasUserId,
    defaultUserId,
  ] = await setupAuthHook();
  const [
    hasDefaultVers,
    defaultVers,
    hasDefaultFdaScrapeAvailVers,
    defaultFdaScrapeAvailVers,
    hasDefaultFdaSectionScrapeAvailVers,
    defaultFdaSectionScrapeAvailVers,
  ] = await setupScrapeVersionsHook();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-
awesome.min.css"
          rel="stylesheet"
          integrity="sha384-
wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
          crossOrigin="anonymous"
        ></link>
      </head>
      <body className="overflow-x-hidden overflow-y-hidden">
        <ClientErrorBoundary>
          <ThemeProvider attribute="class">
            <LoaderProvider>
              <OpenBarProvider>
                <AuthProvider
                  initialData={{
                    hasCreds,
                    defaultCredentials,
                    hasUsername,
                    defaultUsername,
                    hasRole,
                    defaultRole,
                    hasUserId,
                    defaultUserId,
                  }}
                >
                  <FdaVersionsProvider
                    initialData={{
                      hasDefaultVers,
                      defaultVers,
                      hasDefaultFdaScrapeAvailVers,
                      defaultFdaScrapeAvailVers,
                      hasDefaultFdaSectionScrapeAvailVers,
                      defaultFdaSectionScrapeAvailVers,
                    }}
                  >
                    <SideBar>
                      <TableSelectProvider>
                        <div className="h-[100vh] overflow-y-auto">
                          <NavBar />
                          {children}
                          <Footer />
                        </div>
                      </TableSelectProvider>
                    </SideBar>
                  </FdaVersionsProvider>
                </AuthProvider>
              </OpenBarProvider>
            </LoaderProvider>
          </ThemeProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
