"use client"

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@components/Navbar";
import { useEffect } from "react";




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

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle")
  }, [])
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar/>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
