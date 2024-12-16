import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        const uri = process.env.MONGO_DB_URI;
        if (!uri) {
            throw new Error("MongoDB URI is not defined in environment variables.");
        }

        // Connect to MongoDB with necessary options
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,  // Ensure secure connection to MongoDB Atlas
        });

        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export default connectToMongoDB;
