import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gas Monitoring System",
  description: "ESP32-C3 Real-time Gas Sensor Dashboard",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-neutral-800 selection:text-neutral-200">
        {children}
      </body>
    </html>
  );
}