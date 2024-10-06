import mongoose from 'mongoose';
import { DB_NAME } from "../constants/constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('Connected to mongoDb');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
