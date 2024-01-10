import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Login/LoginComponent";
import HeaderComponent from "./components/Header/HeaderComponent";
import { AuthProvider } from "./components/Auth/AuthContext";
import PrivateRoute from "./components/Auth/PrivateRoute";
import MainComponent from "./components/Photos/MainPhotoPageComponent";
import PhotosPageComponent from "./components/Photos/PhotosPageComponent";
import MyUserPageComponent from "./components/User/MyUserPageComponent";

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
          <Route
            path="/photos"
            element={
              <PrivateRoute>
                <PhotosPageComponent />
              </PrivateRoute>
            }
          />
          <Route
            path="/myUser"
            element={
              <PrivateRoute>
                <MyUserPageComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
