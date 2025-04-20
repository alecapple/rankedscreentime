import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "@/firebase/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user ?? null);
      setInitializing(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
