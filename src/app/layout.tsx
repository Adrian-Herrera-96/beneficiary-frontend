import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import AlertProvider from "@/context/AlertProvider";
import { BreadcrumbsComponent } from "@/components/breadcrumbs";
import { Navbar } from "@/components/navbar";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/static";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <AlertProvider>
            <div className="relative flex flex-col h-screen overflow-y-scroll">
              <Navbar />
              <main className="container mx-auto max-w-7xl flex-grow">
                <div className="container">
                  <BreadcrumbsComponent />
                </div>
                {children}
              </main>
            </div>
          </AlertProvider>
        </Providers>
      </body>
    </html>
  );
}
