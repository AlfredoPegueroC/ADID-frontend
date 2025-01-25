"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(WrappedComponent){
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

