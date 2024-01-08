import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { useAuth } from "../Auth/AuthContext";

const Header = () => {
  const { isLoggedIn, logout, userData } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar className="toolbar-container">
        {isLoggedIn && (
          <>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
            <div className="greeting-text">Hello {userData().name}</div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
