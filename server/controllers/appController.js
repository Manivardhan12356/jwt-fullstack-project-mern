import bcrypt from "bcrypt";
import UserModel from "../model/User.model.js";
import jwt from "jsonwebtoken"
import ENV from "../config.js"
import otpGenerator from 'otp-generator'

/** middleware for verify user */
export async function verifyUser(req, res, next) {
   try {

      const { username } = req.method == "GET" ? req.query : req.body;

      // check the user existance
      let exist = await UserModel.findOne({ username });
      if (!exist) return res.status(404).send({ error: "Can't find User!" });
      next();

   } catch (error) {
      return res.status(404).send({ error: "Authentication Error" });
   }
}
/** POST: http://localhost:8080/api/register 
 * @param : {
 *  "username" : "example123",
 *  "password" : "admin123",
 *  "email": "example@gmail.com",
 *  "firstName" : "bill",
 *  "lastName": "william",
 *  "mobile": 8009860560,
 *  "address" : "Apt. 556, Kulas Light, Gwenborough",
 *  "profile": ""
 * }
 */

export async function register(req, res) {
   try {
      const { username, password, profile, email } = req.body;

      // Check for existing username
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
         return res.status(400).send({ error: "Please use a unique username" });
      }

      // Check for existing email
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
         return res.status(400).send({ error: "Please use a unique email" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new UserModel({
         username,
         password: hashedPassword,
         profile: profile || "",
         email
      });

      // Save the user to the database
      await user.save();
      return res.status(201).send({ msg: "User registered successfully" });

   } catch (error) {
      return res.status(500).send({ error: "Unable to register user" });
   }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/


export async function login(req, res) {

   const { username, password } = req.body;

   try {

      UserModel.findOne({ username })
         .then(user => {
            bcrypt.compare(password, user.password)
               .then(passwordCheck => {

                  if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });

                  // create jwt token
                  const token = jwt.sign({
                     userId: user._id,
                     username: user.username
                  }, ENV.JWT_SECRET || "secret", { expiresIn: "24h" });

                  return res.status(200).send({
                     msg: "Login Successful...!",
                     username: user.username,
                     token
                  });

               })
               .catch(error => {
                  return res.status(400).send({ error: "Password does not Match" })
               })
         })
         .catch(error => {
            return res.status(404).send({ error: "Username not Found", error });
         })

   } catch (error) {
      return res.status(500).send({ error });
   }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
   const { username } = req.params;

   try {
      if (!username) {
         return res.status(400).send({ error: "Invalid Username" });
      }

      const user = await UserModel.findOne({ username });

      if (!user) {
         return res.status(404).send({ error: "Couldn't Find the User" });
      }

      return res.status(200).send(user);

   } catch (error) {
      return res.status(500).send({ error: "Cannot Find User Data", error });
   }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
   try {

      const { userId } = req.user;
      console.log(userId)
      if (userId) {
         const body = req.body;

         // update the data
         const result = await UserModel.updateOne({ _id: userId }, body);
         res.status(200).json({ message: 'User updated successfully', result });

      } else {
         return res.status(401).send({ error: "User Not Found...!" });
      }

   } catch (error) {
      return res.status(401).send({ error });
   }
}

/** GET: http://localhost:8080/api/generateOTP
 * 
 * 
 * */


export async function generateOTP(req, res) {
   req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
   res.status(201).send({ code: req.app.locals.OTP })
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
   const { code } = req.query;
   if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      req.app.locals.OTP = null; // reset the OTP value
      req.app.locals.resetSession = true; // start session for reset password
      return res.status(201).send({ msg: 'Verify Successsfully!' })
   }
   return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
   if (req.app.locals.resetSession) {
      return res.status(201).send({ flag: req.app.locals.resetSession })
   }
   return res.status(440).send({ error: "Session expired!" })
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword **/

export async function resetPassword(req, res) {
   try {
      if (!req.app.locals.resetSession) {
         return res.status(440).send({ error: "Session expired!" });
      }

      const { username, password } = req.body;

      // Find the user by username
      const user = await UserModel.findOne({ username });

      if (!user) {
         return res.status(404).send({ error: "Username not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

      // Reset the session
      req.app.locals.resetSession = false;

      return res.status(201).send({ msg: "Record updated!" });

   } catch (error) {
      // Handle any errors that occur
      return res.status(500).send({ error: error.message || "Internal server error" });
   }
}
