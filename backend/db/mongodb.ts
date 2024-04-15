import mongoose from 'mongoose'
const connectToMongodb = async () => {
    try {
        const database = await mongoose.connect(process.env.MONGO_URI || "");
        console.log(`MongoDB connected to ${process.env.MONGO_URI}`);
    } catch (error: any) {
        console.log(`Error connecting to DB: ${(error).message}`);
        process.exit(1);
    }
};

export default connectToMongodb;
