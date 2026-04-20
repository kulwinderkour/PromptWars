import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VenueFlow — Smart Venue Experience",
  description:
    "Real-time crowd intelligence for large-scale sporting venues. Navigate smarter, wait less, enjoy more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-white">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
