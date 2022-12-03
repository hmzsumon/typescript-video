import { Request, Response, NextFunction } from 'express';
import asyncErrorHandler from '../middlewares/asyncErrorHandler';
import User from '../models/User';
import sendToken from '../utils/sendToken';
import ErrorHandler from '../utils/errorHandler';

// test route
export const testing: any = (req: Request, res: Response) => {
	res.send('Hello World');
};

// register user
export const registerUser: any = asyncErrorHandler(
	async (req: Request, res: Response) => {
		const { name, username, email, password } = req.body;
		// check if user exists
		let user = await User.create({ name, username, email, password });

		sendToken(user, 200, res);
	}
);

// login user
export const loginUser: any = asyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { username, password } = req.body;

		// check if email and password is entered by user
		if (!username || !password) {
			return next(new ErrorHandler('Please enter Username & password', 400));
		}

		// finding user in database

		const user = await User.findOne({ username }).select('+password');

		if (!user) {
			return new ErrorHandler('Invalid Username or Password', 401);
		}

		// check if password is correct or not with typescript
		const isPasswordMatched: boolean = await user.comparePassword(password);

		if (!isPasswordMatched) {
			return new ErrorHandler('Invalid Username or Password', 401);
		}

		sendToken(user, 200, res);
	}
);

// logout user
export const logoutUser: any = asyncErrorHandler(
	async (req: Request, res: Response) => {
		res.cookie('token', null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		});

		res.status(200).json({
			success: true,
			message: 'Logged out',
		});
	}
);
