const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./db");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");

dotenv.config();

const app = express();

app.use(express.json()); 

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

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