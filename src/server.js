const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./db");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const chatsRouter = require("./routes/chats.routes");
const messageRouter = require("./routes/message.routes");
const { allowedOrigins } = require("./utils/allowedOrigins");

dotenv.config();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json()); 

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chats", chatsRouter);
app.use("/api/v1/message", messageRouter);

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