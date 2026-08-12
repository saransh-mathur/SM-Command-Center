import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "SM Command Center",
 description: "Next.js Command Center App",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" className="dark">
 <body
 className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b]`}
 >
 <DashboardProvider>
 {children}
 </DashboardProvider>
 </body>
 </html>
 );
}
