import mongoose from "mongoose";

const PATH = "mongodb://localhost:27017/react-node-chat";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(PATH);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

export default connectDB;
