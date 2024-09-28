import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect() {
   try {
      const mongod = await MongoMemoryServer.create(); // Fixed variable name typo
      const getUrl = mongod.getUri();
      mongoose.set('strictQuery', false);
      const db = await mongoose.connect(getUrl);
      console.log("Database connected");
      return db;
   } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Failed to connect to MongoDB");
   }
}

export default connect;
