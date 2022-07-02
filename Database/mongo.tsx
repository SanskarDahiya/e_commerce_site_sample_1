import { MongoClient, Db as DbInstance } from "mongodb";
class MongoWrapper {
  client: MongoClient | undefined;
  db: DbInstance | undefined;
  isConnected: boolean = false;
  MONGODB_URI: string;
  MONGODB_DB: string;
  constructor() {
    const MONGODB_URI = process.env.MONGO_URI;
    const MONGODB_DB = process.env.MONGO_DB;

    // check the MongoDB URI
    if (!MONGODB_URI) {
      throw new Error("Define the MONGODB_URI environmental variable");
    }
    // check the MongoDB DB
    if (!MONGODB_DB) {
      throw new Error("Define the MONGODB_DB environmental variable");
    }
    this.MONGODB_URI = MONGODB_URI + "?retryWrites=true&w=majority";
    this.MONGODB_DB = MONGODB_DB;
  }

  disconnect = async () => {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
    }
  };

  connect = async () => {
    if (!this.isConnected) {
      this.client = new MongoClient(this.MONGODB_URI);
      await this.client.connect();
      this.isConnected = true;
    }
  };

  getUserDB = async () => {
    await this.getDatabase();
    return this.db?.collection("users");
  };

  getCartDB = async () => {
    await this.getDatabase();
    return this.db?.collection("user_cart");
  };

  getItemsDB = async () => {
    await this.getDatabase();
    return this.db?.collection("items");
  };

  getDatabase = async (): Promise<DbInstance | undefined> => {
    await this.connect();
    if (!this.db && this.client) {
      this.db = this.client.db(this.MONGODB_DB);
    }
    return this.db;
  };
}

const InitializeDatabase = () => {
  let dbIns: MongoWrapper;
  return () => {
    if (!dbIns) {
      dbIns = new MongoWrapper();
    }
    return dbIns;
  };
};

export default InitializeDatabase();
