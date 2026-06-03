import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flip Thought",
  description: "Every thought has a flip side.",
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
