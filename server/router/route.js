import { Router } from "express";
import * as controller from '../controllers/appController.js';
import Auth, { localVariables } from "../middleware/auth.js";
import { registerMail } from "../controllers/mailer.js";
const router = Router();

//post  methods
router.route('/register').post(controller.register)//register user
router.route('/registerMail').post(registerMail);
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());//auth user
router.route('/login').post(controller.verifyUser, controller.login)



//get methods
router.route('/user/:username').get(controller.getUser);//user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP)//generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP);//verify generated OTP
router.route('/createResetSession').get(controller.createResetSession);//reset all the variables



//put methods
router.route('/updateuser').put(Auth, controller.updateUser); // is use to updtae to user profile 
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword)// reset passowrd

export default router