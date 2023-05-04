import UserModel from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import ENV from '../config.js';

/** middleware for verify user */
/**
 * Middleware to verify if a user exists in the database
 */
export async function verifyUser(req, res, next){
    try {
        
        // extract the name property from the request object
        const { username } = req.method === "GET" ? req.query : req.body;

        // check if the user exists in the database
        const exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});

        // call the next middleware function
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}



/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",

}
*/
export async function register(req, res) {
    try {
      const { username, password, role, email } = req.body;
  
      // Check for existing user
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return res.status(400).send({ error: "Please use a unique username" });
      }
  
      // Check for existing email
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).send({ error: "Please use a unique email" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const user = new UserModel({
        username,
        password: hashedPassword,
        role: role || "",
        email,
      });
  
      // Save user to database
      const savedUser = await user.save();
      if (!savedUser) {
        return res.status(500).send({ error: "Unable to save user" });
      }
  
      return res.status(201).send({ msg: "User registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }
  
  


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).send({ error: "Username and password are required" });
      }
  
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
  
      const passwordCheck = await bcrypt.compare(password, user.password);
  
      if (!passwordCheck) {
        return res.status(400).send({ error: "Password does not match" });
      }
  
      const token = jwt.sign(
        { userId: user._id, name: user.name },
        ENV.JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      return res.status(200).send({
        msg: "Login successful",
        name: user.name,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }
  

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    try {
      const { username } = req.params;
  
      if (!username) {
        return res.status(400).send({ error: "Invalid username" });
      }
  
      const user = await UserModel.findOne({ username }).select("-password");
  
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
  
      return res.status(200).send(user.toJSON());
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }
  


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    try {
        req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const HTTP_CREATED = 201;
        res.status(HTTP_CREATED).send({ code: req.app.locals.OTP });
    } catch (error) {
        console.error("Error generating OTP:", error);
        const HTTP_INTERNAL_SERVER_ERROR = 500;
        res.status(HTTP_INTERNAL_SERVER_ERROR).send({ error: "Failed to generate OTP" });
    }
}



/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    
    // Input Validation
    if (isNaN(parseInt(code))) {
        return res.status(400).send({ error: "Invalid code. Please enter a number."});
    }
    
    // Check OTP value
    const otp = req.app.locals.OTP;
    if (!otp || parseInt(otp) !== parseInt(code)) {
        return res.status(400).send({ error: "Invalid OTP"});
    }
    
    // Reset OTP and start session for reset password
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    
    // Return success message
    const HTTP_CREATED = 201;
    return res.status(HTTP_CREATED).send({ msg: 'Verify Successfully!'})
}



// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    // Check reset session flag
    if (!req.app.locals.resetSession) {
        const HTTP_SESSION_EXPIRED = 440;
        return res.status(HTTP_SESSION_EXPIRED).send({ error: "Session expired!" });
    }

    // Return reset session flag
    const HTTP_CREATED = 201;
    return res.status(HTTP_CREATED).send({ flag: req.app.locals.resetSession });
}



// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
        // Check reset session flag
        if (!req.app.locals.resetSession) {
            const HTTP_SESSION_EXPIRED = 440;
            return res.status(HTTP_SESSION_EXPIRED).send({ error: "Session expired!" });
        }

        // Input validation
        const { name, password } = req.body;
        if (!name || !password) {
            const HTTP_BAD_REQUEST = 400;
            return res.status(HTTP_BAD_REQUEST).send({ error: "Name and password are required." });
        }

        // Find user by name and update password
        const user = await UserModel.findOne({ name });
        if (!user) {
            const HTTP_NOT_FOUND = 404;
            return res.status(HTTP_NOT_FOUND).send({ error: "Name not found." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updateOne({ name: user.name }, { password: hashedPassword });
        req.app.locals.resetSession = false;

        // Return success message
        const HTTP_CREATED = 201;
        return res.status(HTTP_CREATED).send({ msg: "Record Updated...!" });
    } catch (error) {
        console.error("Error resetting password:", error);
        const HTTP_INTERNAL_SERVER_ERROR = 500;
        return res.status(HTTP_INTERNAL_SERVER_ERROR).send({ error: "Failed to reset password." });
    }
}


