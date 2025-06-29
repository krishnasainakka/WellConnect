import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MongoDB connected: ${connect.connection.host}`);
        console.log(`Database Name: ${connect.connection.name}`);
    } catch (error) {        
        console.log("Error connecting database :", error);
        process.exit(1);
    }
};

export default connectDB;