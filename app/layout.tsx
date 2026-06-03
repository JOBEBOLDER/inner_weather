import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innerweather",
  description: "Your inner forecast, rewritten.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">{children}</body>
    </html>
  );
}
