import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect() {
   const mongd = await (MongoMemoryServer.create())
   const getUrl = mongd.getUri();
   mongoose.set('strictQuery', true)
   const db = await mongoose.connect(getUrl);
   console.log("Database connected")
   return db
}

export default connect;