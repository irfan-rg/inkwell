import type { Metadata, Viewport } from "next";
import { Playfair_Display, JetBrains_Mono, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { OverflowDebugger } from "@/components/dev/OverflowDebugger";

// Display font for headings and brand
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

// Monospace for technical elements
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['Courier New', 'monospace'],
});

// Blog Title Font
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

// Blog Content Font
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: "Inkwell - Modern Publishing",
  description: "A sanctuary for writers and readers.",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${playfair.variable} ${jetbrainsMono.variable} ${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground min-h-screen selection:bg-primary/20 selection:text-primary">
        <TRPCProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            {process.env.NODE_ENV === "development" ? <OverflowDebugger /> : null}
          </ThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}