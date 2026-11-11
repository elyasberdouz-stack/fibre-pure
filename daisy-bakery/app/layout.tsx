import type { Metadata } from "next";
import ClientOnly from "./client-only";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daisy Bakehouse",
  description: "Hand-cut daisy cookies and gift boxes, baked every morning in small batches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientOnly>{children}</ClientOnly>
      </body>
    </html>
  );
}
