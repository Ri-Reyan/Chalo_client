"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import api, { getErrorMessage, type ApiResponse } from "@/lib/axios";

export type UserRole = "CUSTOMER" | "DRIVER";
export type VehicleType = "BIKE" | "CAR";

export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  vehicleType?: VehicleType | null;
  isOnline?: boolean;
  balance?: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  vehicleType?: VehicleType;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  getMe: () => Promise<User | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "chalo_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Helper to determine appropriate destination dashboard based on role.
   */
  const getDashboardPath = useCallback((role: UserRole) => {
    return role === "DRIVER" ? "/driver" : "/customer";
  }, []);

  /**
   * Helper to persist user cache for immediate UI responsiveness.
   */
  const persistUser = useCallback((userData: User | null) => {
    if (typeof window === "undefined") return;
    if (userData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  /**
   * Fetch currently authenticated user via backend GET /auth/me
   * Verified by the HTTP-only accessToken/refreshToken cookies.
   */
  const getMe = useCallback(async (): Promise<User | null> => {
    try {
      setError(null);
      const res = await api.get<ApiResponse<User>>("/auth/me");
      const fetched = res.data?.data;

      if (fetched) {
        const consolidatedUser: User = {
          ...fetched,
          id: fetched.id,
          vehicleType: fetched.vehicleType ?? null,
        };

        setUser(consolidatedUser);
        persistUser(consolidatedUser);
        return consolidatedUser;
      }

      return null;
    } catch (err: any) {
      // 401 error means token expired or invalid session
      if (err.response?.status === 401) {
        // Only clear persistent user if there is no token in localStorage
        const hasToken =
          typeof window !== "undefined" &&
          Boolean(localStorage.getItem("chalo_token"));
        if (!hasToken) {
          setUser(null);
          persistUser(null);
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  /**
   * Execute initial session check on app mount.
   */
  useEffect(() => {
    getMe();
  }, [getMe]);

  /**
   * Authenticate user with email and password via POST /auth/login
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.post<ApiResponse<{ user: User; accessToken?: string } | User>>(
          "/auth/login",
          {
            email: credentials.email.trim().toLowerCase(),
            password: credentials.password,
          },
        );

        // Response envelope returns data: { user: safeUser, accessToken }
        const responseData = res.data?.data as any;
        const loggedUser: User = responseData?.user || responseData;
        const accessToken = responseData?.accessToken;

        if (!loggedUser || !loggedUser.role) {
          throw new Error(
            "Invalid response format received from authentication server.",
          );
        }

        if (accessToken && typeof window !== "undefined") {
          localStorage.setItem("chalo_token", accessToken);
        }

        setUser(loggedUser);
        persistUser(loggedUser);

        // Redirect user based on authenticated role
        const targetPath = getDashboardPath(loggedUser.role);
        router.push(targetPath);

        return loggedUser;
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [router, getDashboardPath, persistUser],
  );

  /**
   * Register a new user (Customer or Driver) via POST /auth/register
   */
  const register = useCallback(
    async (data: RegisterCredentials): Promise<User> => {
      try {
        setLoading(true);
        setError(null);

        const payload: Record<string, any> = {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password,
          role: data.role,
        };

        if (data.role === "DRIVER" && data.vehicleType) {
          payload.vehicleType = data.vehicleType;
        }

        const res = await api.post<ApiResponse<User>>(
          "/auth/register",
          payload,
        );
        const responseData = res.data?.data as any;
        const newUser: User = responseData?.user || responseData;
        const accessToken = responseData?.accessToken;

        if (!newUser || !newUser.role) {
          throw new Error(
            "Invalid response format received from registration server.",
          );
        }

        if (accessToken && typeof window !== "undefined") {
          localStorage.setItem("chalo_token", accessToken);
        }

        setUser(newUser);
        persistUser(newUser);

        // Redirect to appropriate dashboard upon successful registration
        const targetPath = getDashboardPath(newUser.role);
        router.push(targetPath);

        return newUser;
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [router, getDashboardPath, persistUser],
  );

  /**
   * Log out user via POST /auth/logout and clear client state
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await api.post("/auth/logout").catch(() => {
        // Continue clearing client state even if backend logout fails
      });
    } finally {
      setUser(null);
      persistUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("chalo_token");
      }
      setLoading(false);
      router.push("/login");
    }
  }, [router, persistUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      login,
      register,
      logout,
      getMe,
      clearError,
    }),
    [user, loading, error, login, register, logout, getMe, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to consume the AuthContext throughout the application.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
