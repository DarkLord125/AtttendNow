import express from "express";
const router = express.Router();

import { getStudent, addStudent, getallStudent } from "../controllers/student.js";

// Post Methods
router.post('/add', addStudent);

// Get Methods
router.get('/all', getallStudent); 
router.get('/:name', getStudent); // student with name

export default router;