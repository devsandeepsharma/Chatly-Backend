const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./db");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const chatsRouter = require("./routes/chats.routes");
const messageRouter = require("./routes/message.routes");
const { allowedOrigins } = require("./utils/allowedOrigins");
const User = require("./models/user.model");
const Message = require("./models/message.model");

dotenv.config();

const app = express();
const server = http.createServer(app);

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

const onlineUsers = {};

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: allowedOrigins,
    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io:", socket.id);

    socket.on("userOnline", async (userId) => {
        socket.userId = userId;

        if (onlineUsers[userId]) {
            onlineUsers[userId].push(socket.id);
        } else {
            onlineUsers[userId] = [socket.id];
        }

        await User.findByIdAndUpdate(userId, { isOnline: true });
        io.emit("updateUserStatus", { userId, isOnline: true });
    });

    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("sendMessage", (message) => {
        console.log("New message:", message);

        io.to(message.chat._id).emit("receiveMessage", message);

        message.chat.users.forEach(user => {
            if (onlineUsers[user]) {
                onlineUsers[user].forEach(socketId => {
                    const socketInRoom = io.sockets.sockets.get(socketId)?.rooms.has(message.chat._id);
                    if (!socketInRoom) {
                        io.to(socketId).emit("receiveMessage", message);
                    }
                });
            }
        });
    });

    socket.on("typing", ({ chatId, userId }) => {
        socket.to(chatId).emit("typing", { chatId, userId });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
        socket.to(chatId).emit("stopTyping", { chatId, userId });
    });

    socket.on("markAsRead", async ({ chatId, userId }) => {
        try {
            await Message.updateMany(
                { chat: chatId, readBy: { $ne: userId } },
                { $push: { readBy: userId } }
            );

            io.to(chatId).emit("messagesRead", { chatId, userId });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    });

    socket.on("disconnect", async () => {
        if (socket.userId) {
            await User.findByIdAndUpdate(socket.userId, { isOnline: false });

            if (onlineUsers[socket.userId]) {
                onlineUsers[socket.userId] = onlineUsers[socket.userId].filter(id => id !== socket.id);
                if (onlineUsers[socket.userId].length === 0) delete onlineUsers[socket.userId];
            }

            io.emit("updateUserStatus", { userId: socket.userId, isOnline: false });
        }
        console.log("Socket disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`)
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!", err);
    })