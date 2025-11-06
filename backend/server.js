import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import authRouter from "./routes/authRoute.js";
import connectDB from "./config/db.js";
import {socketHandler} from './socket/index.js';
dotenv.config();

const app = express();
const server = createServer(app);
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
      socketHandler(server);
      console.log("Server is runing on :" + process.env.PORT);
    });
  })
  .catch(err => {
    console.error("Database connection failed:", err);
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
app.get("/test", (req, res) => {
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