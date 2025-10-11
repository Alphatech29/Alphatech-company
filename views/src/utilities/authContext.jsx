// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getWebsiteSettings } from "./websiteSettings";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const initialToken = localStorage.getItem("token");

  const [auth, setAuth] = useState({
    token: initialToken,
    user: initialUser,
  });

  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState(null);

  // Fetch website settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getWebsiteSettings();
        if (response.success && response.data.length > 0) {
          setSettings(response.data[0]);
        } else {
          setSettingsError("Failed to load website settings");
        }
      } catch (error) {
        console.error("Error loading website settings:", error);
        setSettingsError("Error loading website settings");
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        settings,
        loadingSettings,
        settingsError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
