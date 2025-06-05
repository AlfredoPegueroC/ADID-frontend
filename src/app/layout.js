"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@components/Navbar";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer, Bounce } from "react-toastify";
import { AuthProvider } from "@contexts/AuthContext";

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
  const isLoginPage = usePathname() === "/login";

  const backgroundClass = isLoginPage ? "login-bg" : "";
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle");
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${backgroundClass}`}
      >
        <AuthProvider>
          {!isLoginPage && <Navbar />}
          <div className="container-fluid px-3">
            <ToastContainer
              position="top-right"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
