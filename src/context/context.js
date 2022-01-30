import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        setuser(user);
        setloading(false)
    },[]);
  });
  if(loading) return "Loading...";
  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
};

export default AuthProvider;
