import { Server } from "socket.io";
// import { saveMessage } from "../controller/message.js";
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

export const socketHandler = server => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    }
  });
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
      // io.to(userToCall).emit('CALL_RECEIVED', { signal: signalData, from });
    });

    // socket.on('ANSWER_CALL', ({ signal, to }) => {
    //   io.to(to).emit('CALL_ACCEPTED', signal);
    // });

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
