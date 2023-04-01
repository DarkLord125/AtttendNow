import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user.js";
import subjectRoutes from "./routes/subject.js";
import studentRoutes from "./routes/student.js";

// Configuration
dotenv.config();
const app = express();
app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

// Routes
app.use("/user", userRoutes);
app.use("/student", studentRoutes);
app.use("/subject", subjectRoutes);

// Mongoose Setup
const PORT= process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})
    .catch((error) => console.log(`${error} did not connect`));