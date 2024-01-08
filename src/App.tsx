import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Login/LoginComponent";
import HeaderComponent from "./components/Header/HeaderComponent";
import { AuthProvider } from "./components/Auth/AuthContext";
import PrivateRoute from "./components/Auth/PrivateRoute";
import MainComponent from "./components/Photos/MainCompoenent";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <HeaderComponent />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
