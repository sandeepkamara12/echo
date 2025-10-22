import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import authRouter from "./routes/authRoute.js";
dotenv.config();

mongoose.connect("mongodb://localhost:27017/react-node-chat");

const app = express();
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("public/images"));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/api', userRoute);
app.use('/', authRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running." + PORT);
});