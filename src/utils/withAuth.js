"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(WrappedComponent) {
  const WithAuthComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Assign displayName to the component for better debugging
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};
