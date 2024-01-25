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

  findUniqueId(existingObjects, startId) {
    const existingIds = new Set(existingObjects.map((item) => item.id));
    let newId = startId;
    while (existingIds.has(newId)) {
      newId++;
    }
    return newId;
  }

  async post(table, object) {
    object.fakeDb = true;
    if (!this.db[table]) {
      this.db[table] = [];
    }

    const existingObjects = await httpService.get(`/${table}`);
    let newId = object.id;

    if (newId !== undefined) {
      newId = this.findUniqueId(existingObjects.data, newId);
    } else {
      newId = this.findUniqueId(existingObjects.data, 1);
    }

    newId = this.findUniqueId(this.db[table], newId);

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
