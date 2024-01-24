import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import usersService, { User } from "../../services/users/users-service";
import photosService, {
  Photo,
  Album,
} from "../../services/images/photos-service";
import { useNavigate } from "react-router-dom";

const SearchComponent: React.FC = () => {
  type SearchResult = User | Photo | Album;
  const [searchText, setSearchText] = useState<string>("");
  const [filter, setFilter] = useState<"User" | "Photo" | "Album">("User");
  const [allData, setAllData] = useState<SearchResult[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleResultClick = (
    event: React.ChangeEvent<{}>,
    value: SearchResult | null
  ) => {
    if (value) {
      if (value && "username" in value) {
        const params = new URLSearchParams();
        params.append("userId", value.id.toString());
        navigate(`/user?${params.toString()}`);
      } else if (value && "thumbnailUrl" in value) {
        const params = new URLSearchParams();
        params.append("photoId", value.id.toString());
        navigate(`/photo?${params.toString()}`);
      } else {
        const params = new URLSearchParams();
        params.append("albumIds", value.id.toString());
        navigate(`/photos?${params.toString()}`);
      }
      //history.push(`/detail-page/${value.id}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const users = await usersService.getUserByName();
      const photos = await photosService.getPhotos();
      const albums = await photosService.getAlbums();
      setAllData([...users, ...photos, ...albums]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const isUser = (item: SearchResult) => "username" in item;
    const isPhoto = (item: SearchResult) => "thumbnailUrl" in item;
    const isAlbum = (item: SearchResult) => "userId" in item;

    const filterFunctions = {
      User: isUser,
      Photo: isPhoto,
      Album: isAlbum,
    };

    const filterByType = (item: SearchResult) =>
      filterFunctions[filter] ? filterFunctions[filter](item) : false;

    const filterData = () => {
      let filtered = allData.filter(filterByType);
      setFilteredOptions(filtered);
    };

    filterData();
  }, [searchText, filter, allData]);

  const handleFilterChange = (
    event: SelectChangeEvent<"User" | "Photo" | "Album">
  ) => {
    setFilter(event.target.value as "User" | "Photo" | "Album");
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <FormControl>
        <InputLabel id="search-filter-label">Filter</InputLabel>
        <Select
          labelId="search-filter-label"
          value={filter}
          label="Filter"
          onChange={handleFilterChange}
        >
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Photo">Photo</MenuItem>
          <MenuItem value="Album">Album</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        style={{ width: "1200px" }}
        onChange={handleResultClick}
        options={filteredOptions}
        disableClearable
        getOptionLabel={(option: string | SearchResult) => {
          if (typeof option === "string") {
            return option;
          } else if ("username" in option) {
            return `${option.username}: ${option.name}`;
          } else if ("albumId") {
            return `${option.id}: ${option.title}`;
          } else {
            return `${option.id}: ${option.title}`;
          }
        }}
        loading={loading}
        onInputChange={(event, newInputValue) => {
          setSearchText(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default SearchComponent;
