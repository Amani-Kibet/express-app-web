const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB (offline/local)
mongoose.connect("mongodb://127.0.0.1:27017/myGameDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define schema
const playerSchema = new mongoose.Schema({
    name: String,
});

// Create model
const Player = mongoose.model("Player", playerSchema);

// Route: Add new player
app.post("/add-player", async (req, res) => {
    try {
        const newPlayer = new Player({ name: req.body.name });
        await newPlayer.save();
        res.send("Player saved to myGameDB!");
    } catch (err) {
        res.status(500).send("Error saving player: " + err.message);
    }
});

// Route: Get all players
app.get("/players", async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        res.status(500).send("Error fetching players: " + err.message);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
