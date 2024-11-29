import express from "express";

const router = express.Router();

// POST route for sending a message
router.post("/send/:id", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        res.status(200).json({ success: true, message: "Message received!" });
    } catch (err) {
        console.error("Error in /send route:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET route for retrieving a message by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        // Replace the following with your database logic to fetch a message
        res.status(200).json({ success: true, message: `Message for ID ${id}` });
    } catch (err) {
        console.error("Error in GET /:id route:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
