import StudentModel from '../models/student.js'

export async function addStudent(req, res) {
    try {
      const { name, rollNo, attendance  } = req.body;
  
      // Check for existing user
      const existingStudent = await StudentModel.findOne({ name });
      if (existingStudent) {
        return res.status(400).send({ error: "Please use a unique name" });
      }
  
      // Check for existing email
      const existingRollno = await StudentModel.findOne({ rollNo });
      if (existingRollno) {
        return res.status(400).send({ error: "Please use a unique roll number" });
      }

      // Create new user
      const student = new StudentModel({
        name,
        rollNo,
        attendance: attendance || "",
      });
  
      // Save user to database
      const savedStudent = await student.save();
      if (!savedStudent) {
        return res.status(500).send({ error: "Unable to save student" });
      }
  
      return res.status(201).send({ msg: "Student registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }



export async function getallStudent(req, res) {
    try {
      const student = await StudentModel.find();
      if (!student) {
        res.status(404).json({ message: "No students found" });
      } else {
        res.status(200).json(student);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export async function getStudent(req, res) {
    try {
      const { name } = req.params;
  
      if (!name) {
        return res.status(400).send({ error: "Invalid name" });
      }
  
      const student = await StudentModel.findOne({ name });
  
      if (!student) {
        return res.status(404).send({ error: "Student not found " });
      }
  
      return res.status(200).send(student.toJSON());
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  };
  
  