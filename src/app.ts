import Express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error';

const app: Application = Express();

// Middleware
app.use(Express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
import userRoute from './routes/userRoute';
import videoRoute from './routes/videoRoute';

// Route middleware
app.use('/api/v1', userRoute);
app.use('/api/v1', videoRoute);

// Error middleware
app.use(errorMiddleware as any);

export default app;
