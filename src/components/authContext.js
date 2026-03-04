import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCurrentUser(parsed);
        setRole(parsed.role || "student");
      }
    } catch (_) {}
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, role }}>
      {children}
    </AuthContext.Provider>
  );
};
