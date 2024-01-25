import React, { useState, useEffect } from "react";
import usersService, { User } from "../../services/users/users-service";
import { useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
const UserComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const query = useQuery();

  useEffect(() => {
    const userId = query?.get("userId");
    const fetchData = async () => {
      const fetchedUser = await usersService.getUserById(userId);
      if (fetchedUser) {
        setUser(fetchedUser);
      }
      const loggedUser = await usersService.getLoggedinUser();
      setLoggedInUserId(loggedUser.id);
    };

    fetchData();
  }, []);

  const handleSave = () => {
    if (user) {
      usersService.saveLoggedinUser(user);
      alert("User data saved!");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUser((prevUser) => {
      if (!prevUser) return null;

      const updateNestedFields = (obj: any, path: string[], value: string) => {
        path.slice(0, -1).forEach((p, index) => {
          obj = obj[p] =
            obj[p] || (Number.isNaN(Number(path[index + 1])) ? {} : []);
        });
        obj[path.pop() as string] = value;
        return obj;
      };

      if (name.includes(".")) {
        const path = name.split(".");
        const updatedUser = { ...prevUser };
        updateNestedFields(updatedUser, path, value);
        return updatedUser;
      }

      return {
        ...prevUser,
        [name]: value,
      };
    });
  };

  if (!user) {
    return <Typography>Loading user data...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">User Details</Typography>
        <Grid container spacing={2} style={{ marginTop: "50px" }}>
          <TextField
            label="ID"
            variant="outlined"
            fullWidth
            disabled
            value={user.id}
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            value={user.name}
            disabled={user.id !== loggedInUserId}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            disabled={user.id !== loggedInUserId}
            value={user.username}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            disabled={user.id !== loggedInUserId}
            value={user.email}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Street"
            variant="outlined"
            fullWidth
            name="address.street"
            disabled={user.id !== loggedInUserId}
            value={user.address.street}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Suite"
            variant="outlined"
            fullWidth
            disabled={user.id !== loggedInUserId}
            name="address.suite"
            value={user.address.suite}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="City"
            variant="outlined"
            fullWidth
            name="address.city"
            disabled={user.id !== loggedInUserId}
            value={user.address.city}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Zipcode"
            variant="outlined"
            fullWidth
            name="address.zipcode"
            value={user.address.zipcode}
            disabled={user.id !== loggedInUserId}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Phone"
            variant="outlined"
            disabled={user.id !== loggedInUserId}
            fullWidth
            name="phone"
            value={user.phone}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Website"
            variant="outlined"
            fullWidth
            disabled={user.id !== loggedInUserId}
            name="website"
            value={user.website}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Company Name"
            variant="outlined"
            fullWidth
            disabled={user.id !== loggedInUserId}
            name="company.name"
            value={user.company.name}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Company catch phrase"
            variant="outlined"
            fullWidth
            name="company.catchPhrase"
            value={user.company.catchPhrase}
            disabled={user.id !== loggedInUserId}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Company bs"
            variant="outlined"
            fullWidth
            disabled={user.id !== loggedInUserId}
            name="company.bs"
            value={user.company.bs}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
          disabled={user.id !== loggedInUserId}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserComponent;
