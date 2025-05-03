import express from 'express'; // Add this line
import { register } from "../controllers/authController.js"; // Add .js extension

const router = express.Router();
router.post("/register", register);

export default router;