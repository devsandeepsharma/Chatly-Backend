const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.header(200).send("<h1>Chatly : Real Time Chat Application");
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on PORT : ${process.env.PORT}`);
})