import React, { useState, useEffect } from "react";
import usersService, { User } from "../../services/users/users-service";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
} from "@mui/material";

const UserComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchedUser = usersService.getLoggedinUser();
    if (fetchedUser) {
      setUser(fetchedUser);
    }
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
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={user.username}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={user.email}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Street"
            variant="outlined"
            fullWidth
            name="address.street"
            value={user.address.street}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Suite"
            variant="outlined"
            fullWidth
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
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Phone"
            variant="outlined"
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
            name="website"
            value={user.website}
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Company Name"
            variant="outlined"
            fullWidth
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
            onChange={handleChange}
            style={{ marginTop: "20px" }}
          />

          <TextField
            label="Company bs"
            variant="outlined"
            fullWidth
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
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserComponent;
