import mongoose, { Mongoose } from "mongoose";
import { cached } from "./mongodb";

const databaseURL = `${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`;
const serverState = process.env.NODE_ENV;

if (serverState === "development" && !databaseURL) throw new Error("Please define the DATABASE_URL environment variable inside .env.local");

const dbConnect = async (): Promise<Mongoose> => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(databaseURL!, opts).then(mongoose => {
            console.log("Connected to MongoDB!");
            return mongoose;
        }).catch(error => {
            cached.promise = null;
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.conn = null;
        cached.promise = null;
        console.error("Failed to establish MongoDB connection:", error);
        throw error;
    }
};

export default dbConnect;