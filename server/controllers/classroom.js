import ClassroomModel from '../models/classroom.js'
import StudentModel from '../models/student.js'

export async function addClassroom(req, res) {
    try {
      const { name, date, startTime, endTime  } = req.body;
  
      // Create new classroom
      const classroom = new ClassroomModel({
        name,
        date,
        startTime,
        endTime
      });
  
      // Save classroom to database
      const savedClassroom = await classroom.save();
      if (!savedClassroom) {
        return res.status(500).send({ error: "Unable to save Classroom" });
      }
  
      return res.status(201).send({ msg: "Classroom created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }

export async function getallClassrooms(req, res) {
    try {
      const classroom = await ClassroomModel.find();
      if (!classroom) {
        res.status(404).json({ message: "No classrooms found" });
      } else {
        res.status(200).json(classroom);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export async function getClassroom(req, res) {
    try {
      const { name } = req.params;
  
      if (!name) {
        return res.status(400).send({ error: "Invalid name" });
      }
  
      const classroom = await ClassroomModel.findOne({ name });
  
      if (!classroom) {
        return res.status(404).send({ error: "Classroom not found " });
      }
  
      return res.status(200).send(classroom.toJSON());
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  };

  export async function updateClassroom(req, res) {
    const { name } = req.params;
    const classroomData = req.body;
  
    try {
      const updatedClassroom = await ClassroomModel.findOneAndUpdate({ name }, classroomData, { new: true });
      if (!updatedClassroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      res.json(updatedClassroom);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  export async function updateClassroomStudents(req, res) {
    const { name } = req.params;
    const classroom = await ClassroomModel.findOne({ name: name }).populate('students');
  
    try {
      const studentData = await Promise.all(classroom.students.map(async (student) => {
        const studentDoc = await StudentModel.findById(student._id);
        if (!studentDoc) {
          return null;
        }
        const { name, rollNo } = studentDoc;
        return { id: student._id, name, rollNo };
      }).filter(Boolean));
      
      res.json({ name: classroom.name, students: studentData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  
