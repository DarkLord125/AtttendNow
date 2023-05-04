import express from "express";
const router = express.Router();

import { addClassroom, getallClassrooms, getClassroom, updateClassroom, updateClassroomStudents } from "../controllers/classroom.js";

// Post Methods
router.post('/add', addClassroom);

// Get Methods
router.get('/all', getallClassrooms);
router.get('/:name/get', getClassroom);
router.get('/:name', updateClassroomStudents)

router.put('/:name/put', updateClassroom);

export default router;