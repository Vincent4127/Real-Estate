import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const NameContext = createContext(null);
const EmailContext = createContext(null);

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    return localStorage.getItem("isSignedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isSignedIn", String(isSignedIn));
  }, [isSignedIn]);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function NameProvider({ children }) {
    const [name, setName] = useState(() => {
        return localStorage.getItem("name") || "";
    });

    useEffect(() => {
        localStorage.setItem("name", name);
    }, [name])

    return (
        <NameContext.Provider value={{ name, setName }}>
            {children}
        </NameContext.Provider>
    );
}

export function EmailProvider({ children }) {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("email") || "";
  })

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email])

  return (
    <EmailContext.Provider value={{email, setEmail}}>
      {children}
    </EmailContext.Provider>
  )

}

export function useAuth() {
    return useContext(AuthContext);
}

export function useName() {
    return useContext(NameContext);
}

export function useEmail(){
  return useContext(EmailContext);
}
