import httpService from "../http-service";

class AlbumService {
  async getLoggedUserAlbumIds() {
    const user = JSON.parse(localStorage.getItem("user"));
    const albumsResponse = await httpService.get(`/albums?userId=${user.id}`);
    const albumIds = albumsResponse.data.map((x) => x.id);
    return albumIds;
  }
}

const albumService = new AlbumService();

export default albumService;
