const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./db");

dotenv.config();

const app = express();

app.get("/api", (req, res) => {
    res.header(200).send("<h1>Chatly : Real Time Chat Application");
})

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    });
})
.catch((err) => {
    console.log("MongoDB connection failed !!", err);
})