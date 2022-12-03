import { Schema, model } from 'mongoose';

export interface IVideo {
	title: string;
	description: string;
	videoUrl: string;
	createdAt: Date;
	updatedAt: Date;
	duration: number;
	thumbnail: string;
	author: string;
	videoId: string;
}

const videoSchema = new Schema<IVideo>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		videoUrl: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		thumbnail: {
			type: String,
			required: true,
		},

		author: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model<IVideo>('Video', videoSchema);
