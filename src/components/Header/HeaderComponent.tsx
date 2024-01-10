import { AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const Header = () => {
  const { isLoggedIn, logout, userData } = useAuth();
  const navigate = useNavigate();

  const mainPage = async () => {
    navigate(`/`);
  };

  const userPage = async () => {
    navigate(`/myUser`);
  };

  return (
    <AppBar position="static">
      <Toolbar className="toolbar-container">
        {isLoggedIn && (
          <>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
            <Button color="inherit" onClick={mainPage}>
              Main Page
            </Button>
            <Button color="inherit" onClick={userPage}>
              Hello {userData().name}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
