import '../loadEnvironment.js'
import { MongoClient } from "mongodb";
import mongoose from 'mongoose';

const URL = process.env.MONGO_URI || "";
const CLIENT = new MongoClient(URL);

await mongoose.connect(URL, {
    dbName: "Module09-10"
});

let DB;

try {
    await CLIENT.connect();
    DB = CLIENT.db("Module09-10");
    console.log("Connected to MongoDB");
} catch(e) {
    console.error("MongoDB connection error:", e);
}

export default DB;