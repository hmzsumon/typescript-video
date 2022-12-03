import { Router } from 'express';
import {
	testing,
	registerUser,
	loginUser,
	logoutUser,
} from '../controllers/userController';

// Test route
const router = Router();

router.get('/test', testing);

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

export default router;
