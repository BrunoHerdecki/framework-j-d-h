import httpService from "../http-service";

class FakeDatabaseService {
  constructor() {
    this.db = localStorage.getItem("db")
      ? JSON.parse(localStorage.getItem("db"))
      : {};
  }

  saveToLocalStorage() {
    localStorage.setItem("db", JSON.stringify(this.db));
  }

  findNextAvailableId(table) {
    if (this.db[table].length === 0) return 1;
    return Math.max(...this.db[table].map((item) => item.id)) + 1;
  }

  async post(table, object) {
    object.fakeDb = true;
    if (!this.db[table]) {
      this.db[table] = [];
    }

    const existingObjects = await httpService.get(`/${table}`);
    let newId = object.id;

    if (newId !== undefined) {
      while (existingObjects.data.find((item) => item.id === newId)) {
        newId++;
      }
    } else {
      newId = 1;
      while (existingObjects.data.find((item) => item.id === newId)) {
        newId++;
      }
    }

    while (this.db[table].find((item) => item.id === newId)) {
      newId++;
    }

    const existingIndex = this.db[table].findIndex(
      (item) => item.id === object.id
    );

    if (existingIndex !== -1) {
      this.db[table][existingIndex] = object;
    } else {
      object.id = newId;
      this.db[table].push(object);
    }

    this.saveToLocalStorage();
  }

  get(table, id) {
    const tableData = this.db[table];
    if (!tableData) {
      return null;
    }
    if (id === undefined) {
      return tableData;
    }
    return tableData.find((item) => item.id === id);
  }

  delete(table, id) {
    const tableData = this.db[table];
    if (!tableData) {
      return;
    }

    const itemIndex = tableData.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return;
    }

    this.db[table].splice(itemIndex, 1);
    this.saveToLocalStorage();
  }
}

const fakeDbService = new FakeDatabaseService();

export default fakeDbService;
