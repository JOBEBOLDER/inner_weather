import type { Metadata } from "next";
import CloudBackground from "@/components/CloudBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "InnerWeather",
  description: "让想法换个角度发光。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        <CloudBackground />
        {children}
      </body>
    </html>
  );
}
