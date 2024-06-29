import { NavBar, Footer, SideBar } from "@/components";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider, OpenBarProvider } from "@/contexts";

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
      <body>
        <ThemeProvider attribute="class">
          <OpenBarProvider>
            <AuthProvider>
              <SideBar>
                <NavBar />
                {children}
                <Footer />
              </SideBar>
            </AuthProvider>
          </OpenBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
