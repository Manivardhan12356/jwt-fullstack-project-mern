import bcrypt from "bcrypt";
import UserModel from "../model/User.model.js";
import jwt from "jsonwebtoken"
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
            return res.status(404).send({ error: "Username not Found" });
         })

   } catch (error) {
      return res.status(500).send({ error });
   }
}
