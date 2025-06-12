import { AuthState } from "./types";

let authState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    authState = {
      isAuthenticated: true,
      user: data.user,
    };

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signup = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const logout = () => {
  authState = {
    isAuthenticated: false,
    user: null,
  };
};

export const getAuthState = () => authState;
