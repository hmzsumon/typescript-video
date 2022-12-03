import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

export interface IUser {
	name: string;
	username: string;
	password: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
	role: string;
	resetPasswordToken: string;
	resetPasswordExpires: Date;
	comparePassword: (enteredPassword: string) => Promise<boolean>;
	getResetPasswordToken: () => Promise<string>;
	getJWTToken: () => string;
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		role: {
			type: String,
			default: 'user',
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
	return jwt.sign({ id: this._id }, 'somthing', {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// get reset password token
userSchema.methods.getResetPasswordToken = async function () {
	// generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// generate hash token and add to db
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

	return resetToken;
};

export default model<IUser>('User', userSchema);
