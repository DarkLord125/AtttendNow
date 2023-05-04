import mongoose from "mongoose";

// User schema
export const UserSchema = new mongoose.Schema({
     username: {
         type: String,
         required: true,
         unique: [true, "name Exists"],
     },
     password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: true,
    },
    role: {
        type: String,
    },
},
    { timestamps: true}
)

export default mongoose.model.Users || mongoose.model('User', UserSchema);