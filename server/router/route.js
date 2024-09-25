import { Router } from "express";
import * as controller from '../controllers/appController.js';
const router = Router();

//post  methods
router.route('/register').post(controller.register)//register user
router.route('/registerMail').post((req, res) => {
   res.json('register route ')//send the email
})
router.route('/authenticate').post((req, res) => {
   res.json('register route ')//authenticate user
})
router.route('/login').post((req, res) => {
   res.json('register route ') //login in app
})



//get methods
router.route('/user/:username').get();//user with username
router.route('generateOTP').get();//generate random OTP
router.route('/verifyOTP').get();//verify generated OTP
router.route('/createResetSession').get();//reset all the variables



//put methods
router.route('/updateuser').put(); // is use to updtae to user profile 
router.route('/resetPassword').put()// reset passowrd

export default router