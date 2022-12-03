import { Request, Response, NextFunction } from 'express';
import asyncErrorHandler from '../middlewares/asyncErrorHandler';
import User from '../models/User';
import cloudinary from 'cloudinary';
import Video from '../models/Video';

import ErrorHandler from '../utils/errorHandler';

var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();

declare module 'express' {
	export interface Request {
		file: any;
	}
}

//  Upload video
export const uploadVideo: any = asyncErrorHandler(
	async (req: Request, res: Response) => {
		const result = await cloudinary.v2.uploader.upload(req.file.path, {
			resource_type: 'video',
			folder: 'videos',
		});

		// convert duration from miliseconds to minutes
		let duration = (result.duration / 60).toFixed(2);

		let thumbUrl = result.secure_url.replace('.mp4', '.webp');

		// save the video to the database
		const video = await Video.create({
			title: req.body.title,
			description: req.body.description,
			videoUrl: result.secure_url,
			thumbnail: thumbUrl,
			duration: duration,
			author: req.body.author,
		});

		res.status(200).json({
			success: true,
			message: 'Video uploaded successfully',
			video,
		});
	}
);

// get all videos
export const getVideos: any = asyncErrorHandler(
	async (req: Request, res: Response) => {
		const videos = await Video.find();

		res.status(200).json({
			success: true,
			videos,
		});
	}
);

// get a single video
export const getVideo: any = asyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const video = await Video.findById(req.params.id);

		if (!video) {
			return next(new ErrorHandler('Video not found', 404));
		}

		res.status(200).json({
			success: true,
			video,
		});
	}
);

// get related videos by title
export const getRelatedVideos: any = asyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const videos = await Video.find({
			title: { $regex: req.params.title, $options: 'i' },
		});
		if (!videos) {
			return next(new ErrorHandler('No related videos found', 404));
		}
		res.status(200).json({
			success: true,
			videos,
		});
	}
);

// search videos by title
export const searchVideos: any = asyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const videos = await Video.find({
			title: { $regex: req.params.title, $options: 'i' },
		});
		if (!videos) {
			return next(new ErrorHandler('No videos found', 404));
		}
		res.status(200).json({
			success: true,
			videos,
		});
	}
);
