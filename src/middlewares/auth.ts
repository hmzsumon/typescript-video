import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';
import asyncErrorHandler from './asyncErrorHandler';

declare module 'express' {
	export interface Request {
		user: any;
	}
}

// Check if user is authenticated or not
export const isAuthenticatedUser = asyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { token } = req.cookies;

		if (!token) {
			return next(
				new ErrorHandler('Login first to access this resource.', 401)
			);
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		req.user = await User.findById(decoded.id);

		next();
	}
);

// Handling users roles
export const authorizeRoles = (...roles: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					`Role (${req.user.role}) is not allowed to access this resource`,
					403
				)
			);
		}
		next();
	};
};
