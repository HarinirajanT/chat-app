import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"; 
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import {app,server} from './socket/socket.js';

dotenv.config();

const __dirname=path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON data from requests
app.use(cookieParser());


// Use the auth routes under /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Root route to check if the server is running
app.use(express.static(path.join(__dirname, "/front_end/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "front_end", "dist", "index.html"));
});

// Start the server and connect to MongoDB
server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
