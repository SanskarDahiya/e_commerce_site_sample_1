import { MongoClient } from "mongodb";
class MongoWrapper {
  client: MongoClient;
  dbName: string;
  db: any;
  isConnected: boolean = false;
  constructor(params: any) {
    const { uri: MONGODB_URI, db: MONGODB_DB, options } = params || {};
    // check the MongoDB URI
    if (!MONGODB_URI) {
      throw new Error("Define the MONGODB_URI environmental variable");
    }
    // check the MongoDB DB
    if (!MONGODB_DB) {
      throw new Error("Define the MONGODB_DB environmental variable");
    }
    this.client = new MongoClient(MONGODB_URI, options);
    this.dbName = MONGODB_DB;
  }

  disconnect = async () => {
    await this.client.close();
    this.isConnected = false;
  };
  connect = async () => {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  };
  getDatabase = () => {
    if (!this.db) {
      this.db = this.client.db(this.dbName);
    }
    return this.db;
  };
}
const InitializeDatabase = () => {
  let dbIns: MongoWrapper;
  return (params: any) => {
    if (!dbIns) {
      dbIns = new MongoWrapper(params);
    }
    return dbIns;
  };
};

export default InitializeDatabase();
