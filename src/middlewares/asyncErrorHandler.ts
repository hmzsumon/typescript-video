import { Request, Response, NextFunction } from 'express';

const asyncErrorHandler =
	(errorFunction: any) => (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(errorFunction(req, res, next)).catch(next);
	};

export default asyncErrorHandler;
