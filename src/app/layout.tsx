import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balkan Foods | A Table Worth Travelling For",
  description:
    "Discover Balkan-inspired cooking, a welcoming table and warm hospitality at Balkan Foods. Explore the menu and request a table.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
