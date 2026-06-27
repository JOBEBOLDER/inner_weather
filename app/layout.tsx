import type { Metadata } from "next";
import CloudBackground from "@/components/CloudBackground";
import { LocaleProvider } from "@/components/LocaleProvider";
import { ReceiptsProvider } from "@/components/ReceiptsProvider";
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
    <html lang="zh" suppressHydrationWarning>
      <body className="antialiased">
        <LocaleProvider>
          <ReceiptsProvider>
            <CloudBackground />
            {children}
          </ReceiptsProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
