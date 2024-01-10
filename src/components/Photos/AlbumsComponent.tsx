import React, { useState, useEffect } from "react";
import {
  Grid,
  Pagination,
  Paper,
  Select,
  MenuItem,
  DialogContent,
} from "@mui/material";
import httpService from "../../services/http-service";
import { SelectChangeEvent } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const AlbumsComponent: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState("");
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await httpService.get("/users");
        const albumsResponse = await httpService.get("/albums");
        setAlbums(albumsResponse.data);
        setUsers(usersResponse.data);

        const photosResponse = await httpService.get("/photos");
        setPhotos(photosResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    const selectedUserId = event.target.value;
    setSelectedUser("");
    setPage(1);
    setSelectedUser(selectedUserId);
  };

  const handleAlbumClick = async (album: Album) => {
    const params = new URLSearchParams();
    params.append("albumIds", album.id.toString());
    navigate(`/photos?${params.toString()}`);
  };

  const filteredAlbums = selectedUser
    ? albums.filter((album) => album.userId.toString() === selectedUser)
    : albums;

  return (
    <div className="img-container">
      <div className="margin-20">
        <div>Select user</div>
        <Select
          className="width-300"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id.toString()}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Grid container spacing={2} className="img-box">
        {filteredAlbums
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((album) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
              <Paper
                onClick={() => handleAlbumClick(album)}
                className="img-item alb-item"
              >
                <div className="img-title">{album.title}</div>
                <DialogContent>
                  {photos
                    .filter((photo) => photo.albumId === album.id)
                    .slice(0, 4)
                    .map((photo) => (
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        key={photo.id}
                        className="thumbnail"
                      />
                    ))}
                </DialogContent>
              </Paper>
            </Grid>
          ))}
      </Grid>
      <Pagination
        count={Math.ceil(filteredAlbums.length / itemsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
        className="margin-20"
      />
    </div>
  );
};

export default AlbumsComponent;
