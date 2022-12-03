import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import {
	uploadVideo,
	getVideos,
	getVideo,
	getRelatedVideos,
} from '../controllers/videoController';

const router = Router();

const UPLOAD_FOLDER = path.join(__dirname, '../../uploads');

// storage
const storage = multer.diskStorage({
	destination: (req: Request, file: any, cb: any) => {
		cb(null, UPLOAD_FOLDER);
	},

	filename: (req: Request, file: any, cb: any) => {
		const fileName = file.originalname.toLowerCase().split(' ').join('-');
		cb(null, fileName);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req: Request, file: any, cb: any) => {
		if (file.mimetype === 'video/mp4') {
			cb(null, true);
		} else {
			cb(new Error('File type not supported'), false);
		}
	},
});

// Upload video
router.post('/upload', upload.single('video'), uploadVideo);

// Get all videos
router.get('/videos', getVideos);

// Get a single video
router.get('/video/:id', getVideo);

// Get related videos
router.get('/related/:id', getRelatedVideos);

export default router;
