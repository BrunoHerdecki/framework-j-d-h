import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import usersService from "../../services/users/users-service";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: any) => void;
  userData: () => any;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (userData()) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user: any) => {
    usersService.saveLoggedinUser(user);
    setIsLoggedIn(true);
  };

  const userData = () => {
    return usersService.getLoggedinUser();
  };

  const logout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
