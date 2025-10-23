import { Server } from "socket.io";
// import { saveMessage } from "../controller/message.js";
let onlineUsers = [];

const addUser = (user, socketId) => {
  const existingIndex = onlineUsers.findIndex(u => u._id === user?._id);
  if (existingIndex !== -1) {
    onlineUsers.splice(existingIndex, 1);
  }
  if(user) {
    user.socketId = socketId;
    onlineUsers.push(user);
  }
};

const removeUser = (socketId) => {
  const isExist = onlineUsers.findIndex((item) => item.socketId === socketId);
  if (isExist !== -1) {
    onlineUsers.splice(isExist, 1);
  }
};

export const socketHandler = server => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    }
  });
  io.on("connection", (socket) => {
    socket.on("LOGGEDIN_USER", async (user)=>{
      socket.join(user._id);
      addUser(user, socket.id);
      io.emit("ONLINE_USERS", onlineUsers);  
    });
  //   socket.on("ADD_USER", (user) => {
  //     addUser(user, socket.id);
  //     io.emit("USER_ADDED", onlineUsers);      
  //   });
  //   socket.on("SEND_MESSAGE", async (data) => {
  //     console.log(data, 'with reply message')
  //     const isSaved = await saveMessage(data);
  //     io.to(data?.receiver?.socketId).to(data.sender.socketId).emit("RECEIVED_MESSAGE", isSaved);
  //   });

    // socket.on("SEND_MESSAGE", async (data) => {
    //   let savedMessage = await saveMessage(data);
    //   io.to(data?.receiver?.socketId).to(data?.sender?.socketId).emit("RECEIVED_MESSAGE", savedMessage);
    // });

    // socket.on("DELETE_MESSAGE", (data) => {
    //   socket.to(data.receiver.socketId).emit("DELETED_MESSAGE", data);
    // });
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("ONLINE_USERS", onlineUsers);
    });
  });
};
