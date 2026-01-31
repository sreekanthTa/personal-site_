import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./common/nav/page";
import ChatUI from "./common/chat/page";
import WebLLMProvider from "./common/providers/webllm"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Learning App",
  description: "Contains My Learning notes here...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav/>
        <WebLLMProvider>

           {children}

        </WebLLMProvider>
          
      </body>
    </html>
  );
}
