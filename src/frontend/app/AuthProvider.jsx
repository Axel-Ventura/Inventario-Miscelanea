"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { SessionSync } from "@/components/SessionSync";

export default function AuthProvider({ children }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <SessionSync />
      {children}
    </>
  );
}