"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api-base";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setIsLoading(false);
        return false;
      }

      localStorage.setItem("token", data.token);

      setIsAuthenticated(true);
      setIsLoading(false);
      return true;

    } catch (err) {
      setError("Error de conexión");
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");

    await fetch(apiUrl("/api/auth/logout"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const clearError = () => setError(null);

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    error,
    clearError,
  };
};