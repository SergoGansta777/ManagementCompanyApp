import { LoginUser, SignupUser } from "@/api/authApi";
import { LoginInput, SignupInput } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  signup: (signupInput: SignupInput) => Promise<void>;
  login: (loginInput: LoginInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwtToken"),
  );

  const login = async (loginInput: LoginInput) => {
    const response = await LoginUser(loginInput);
    const token = response.user.token;
    localStorage.setItem("jwtToken", token);
    setToken(token);
  };

  const signup = async (signupInput: SignupInput) => {
    const response = await SignupUser(signupInput);
    const token = response.user.token;
    localStorage.setItem("jwtToken", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
