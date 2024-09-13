import { NavBar, Footer, SideBar } from "@/components";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider, OpenBarProvider, LoaderProvider } from "@/contexts";

export const metadata = {
  title: "RXScope",
  description: "Generated by RXScope",
  icons: {
    icon: "https://www.iconninja.com/files/631/966/414/repository-github-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body>
        <ThemeProvider attribute="class">
          <LoaderProvider>
            <OpenBarProvider>
              <AuthProvider>
                <SideBar>
                  <NavBar />
                  {children}
                  <Footer />
                </SideBar>
              </AuthProvider>
            </OpenBarProvider>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
