import mongoose from "mongoose";

export const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  attendance: {
    type: Boolean,
    default: false
  }
},
    { timestamps: true}
);

export default mongoose.model.Students || mongoose.model('Student', studentSchema);
