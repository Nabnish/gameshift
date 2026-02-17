"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminComponent from "@/components/AdminComponent";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/admin/verify");
        if (response.ok) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to verify admin access:", error);
        setIsAuthorized(false);
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0b2e] to-[#4a1c6e]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <AdminComponent />;
}
