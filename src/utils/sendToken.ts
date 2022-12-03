const COOKIE_EXPIRE: any = process.env.COOKIE_EXPIRES_TIME!;

const sendToken = (user: any, statusCode: number, res: any) => {
	const token = user.getJWTToken();
	const options = {
		expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		user,
		token,
	});
};

export default sendToken;
