import express from "express";

import { register, verifyUser, login, getUser, generateOTP, verifyOTP, createResetSession, resetPassword } from "../controllers/user.js";
import { registerMail } from '../controllers/mailer.js'
import { localVariables } from '../middleware/auth.js';

const router = express.Router();


// Post Methods
router.post('/register',register);

router.post('/registerMail',registerMail); // send the email
router.post('/authenticate',verifyUser, (req, res) => res.end()); // authenticate user
router.post('/login',verifyUser,login); // login in app

// Get Methods
router.get('/enduser/:username',getUser) // user with username
router.get('/generateOTP',verifyUser, localVariables, generateOTP) // generate random OTP
router.get('/verifyOTP',verifyUser, verifyOTP) // verify generated OTP
router.get('/createResetSession',createResetSession) // reset all the variables


// Put Methods
router.put('/resetPassword',verifyUser, resetPassword); // use to reset password

export default router;