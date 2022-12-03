import mongoose from 'mongoose';
const MONGO_URI: string = process.env.MONGO_URI || 'mongodb://localhost:27017';

const connectDB = () => {
	mongoose
		.connect(MONGO_URI)
		.then(() => console.log('MongoDB connected'))
		.catch((err) => console.log(err));
};

export default connectDB;
