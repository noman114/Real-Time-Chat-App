import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { poppins } from "@/fonts/fonts";

export const metadata: Metadata = {
  title: "Fast Connect",
  description: "Fast Connect: Your all-in-one platform for real-time chat, seamless communication, and more. Stay connected effortlessly with our fast, secure, and user-friendly solutions designed to enhance your online experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}