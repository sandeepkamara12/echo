import express from "express";
import { createServer } from "http";
import { ExpressPeerServer } from "peer";
import dotenv from "dotenv";
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import authRouter from "./routes/authRoute.js";
import connectDB from "./config/db.js";
import { socketHandler } from './socket/index.js';
import { Server } from "socket.io";
dotenv.config();

const app = express();
const server = createServer(app);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
      // socketHandler(server);
      console.log("Server is runing on :" + process.env.PORT);
    });
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/", // you can customize path e.g. "/peerjs"
});
peerServer.on("connection", (client) => {
  console.log("Peer connected:", client.id);
});

peerServer.on("disconnect", (client) => {
  console.log("Peer disconnected:", client.id);
});
app.use("/peerjs", peerServer);


const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

let onlineUsers = [];

const addUser = (user, socketId) => {
  const existingIndex = onlineUsers.findIndex(u => u._id === user?._id);
  if (existingIndex !== -1) {
    onlineUsers.splice(existingIndex, 1);
  }
  if (user) {
    user.socketId = socketId;
    onlineUsers.push(user);
  }
};

// Remove user from online users when a user disconnect / close tab / close browser / logout
const removeUser = (socketId) => {
  const isExist = onlineUsers.findIndex((item) => item.socketId === socketId);
  if (isExist !== -1) {
    onlineUsers.splice(isExist, 1);
  }
};
io.on("connection", (socket) => {
  socket.emit("ME", socket.id);

  socket.on('chatMessage', msg => {
    io.emit('chatMessage', msg);
  });


  // Add a user in online users when a user loggedin
  socket.on("LOGGEDIN_USER", async (user) => {
    socket.join(user._id);
    addUser(user, socket.id);
    io.emit("ONLINE_USERS", onlineUsers);
  });

  socket.on('CallToUser', (data) => {
    console.log(data, 'from');
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("ONLINE_USERS", onlineUsers);
  });
});



app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("public/images"));

app.set('view engine', 'ejs');
app.set('views', './views');
app.get("/", (req, res) => {
  console.log("API test endpoint hit");
  res.status(200).json({
    success: true,
    message: "🚀 API is working perfectly!",
  });
});
app.use('/api', userRoute);
app.use('/', authRouter);

// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//     console.log("Server is running." + PORT);
// });