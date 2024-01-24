import httpService from "../http-service";

class UsersService {
  getLoggedinUser(): User {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  saveLoggedinUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  async getUserById(userId: string | null): Promise<User> {
    const dbResponse = await httpService.get(`/users?id=${userId}`);
    return dbResponse.data[0];
  }

  async getUserByName(): Promise<User[]> {
    const dbResponse = await httpService.get(`/users`);
    return dbResponse.data;
  }
}

const usersService = new UsersService();

export default usersService;

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
