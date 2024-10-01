import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@tribal-cities/ui";
import { ThemeProvider, ThemeToggle } from "@tribal-cities/ui/theme";
import { Toaster } from "@tribal-cities/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import Script from "next/script";

import { TooltipProvider } from "@tribal-cities/ui/tooltip";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://tribalcities.com"
      : "http://localhost:3000",
  ),
  title: "Tribal Cities - Where Burners Organize",
  description: "Tribal Cities is a platform for organizing burner events",
  openGraph: {
    title: "Tribal Cities - Where Burners Organize",
    description: "Tribal Cities is a platform for organizing burner events",
    url: "https://www.tribalcities.com",
    siteName: "TribalCities",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css"
        />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
        />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"
        />

        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-8CHBB2ESKH`}
        />
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8CHBB2ESKH', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </head>
      <body
        className={cn(
          "h-screen overflow-scroll bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
          </TooltipProvider>
          {/* </BurnContext> */}
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
