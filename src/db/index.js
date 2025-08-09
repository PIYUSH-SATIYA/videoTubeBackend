import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}`
        );
        // There should be ongoose.connect(
        // `${process.env.MONGODB_URI}/${DB_NAME}
        // But due to some error in srv link, i have to use non srv one, which does not require the db_name, so removed and now it connects successfully
        console.log(
            `\n MongoDB connected | DB host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error(" MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
