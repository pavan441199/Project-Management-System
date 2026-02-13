import mongoose from "mongoose";
import { config } from "./app-config";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection error", error);
        process.exit(1);
    }
}

export default connectToDatabase;