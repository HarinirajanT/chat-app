import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        const uri = process.env.MONGO_DB_URI;  // Ensure MONGO_DB_URI is set in your .env file
        if (!uri) {
            throw new Error("MongoDB URI is not defined in environment variables.");
        }

        // Connect to MongoDB without deprecated options
        await mongoose.connect(uri);

        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export default connectToMongoDB;
