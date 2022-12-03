import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ErrorHandler from '../utils/errorHandler';

const errorMiddleware = (
	err: ErrorHandler,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal Server Error';

	// mongo id error
	if (err.name === 'CastError') {
		const message = `Resource not found. Invalid: ${err.path}`;
		err = new ErrorHandler(message, 400);
	}

	// mongoose duplicate key error
	if (err.code === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
		err = new ErrorHandler(message, 400);
	}
	// wrong jwt error
	if (err.code === 'JsonWebTokenError') {
		const message = 'JWT Error';
		err = new ErrorHandler(message, 400);
	}

	// jwt expire error
	if (err.code === 'JsonWebTokenError') {
		const message = 'JWT is Expired';
		err = new ErrorHandler(message, 400);
	}

	res.status(err.statusCode).json({
		success: false,
		error: err.message,
	});
};

export default errorMiddleware;
