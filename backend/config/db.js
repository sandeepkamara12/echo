import mongoose from "mongoose";
const PATH = process.env.MONGO_URI;
// const PATH = "mongodb+srv://sandeepkamara_circle:2LSF6s35c5VciEEu@circle.pgdamog.mongodb.net";
// const PATH = "mongodb://localhost:27017/react-node-chat";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(PATH);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

export default connectDB;
