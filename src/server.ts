import app from './app';
import 'dotenv/config';
import connectDatabase from './config/database';

const cloudinary = require('cloudinary');

connectDatabase();

// configure cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
