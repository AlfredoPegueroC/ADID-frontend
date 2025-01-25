"use client"

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@components/Navbar";
import { useEffect } from "react";
import { usePathname } from "next/navigation";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const isLoginPage = usePathname() === '/login';
  
  const backgroundClass = isLoginPage ? "login-bg" : "";
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle")
  }, [])
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${backgroundClass}`}>
        {!isLoginPage && <Navbar/>}
        <div className="container-fluid px-5">
          {children}
        </div>
      </body>
    </html>
  );
}
