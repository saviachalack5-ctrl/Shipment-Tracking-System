import { createContext, useContext } from "react";

export const AuthContext = createContext({
  auth: null,
  setAuthState: () => {},
  clearAuthState: () => {},
});

export const useAuth = () => useContext(AuthContext);
