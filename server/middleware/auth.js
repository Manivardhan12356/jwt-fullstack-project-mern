import jwt from "jsonwebtoken"
import Env from '../config.js'
export default async function Auth(req, res, next) {
   try {
      // access authorize header to validate request
      const token = req.headers.authorization.split(" ")[1];
      const decodeToken = await jwt.verify(token, Env.JWT_SECRET);
      req.user = decodeToken;
      next()
   } catch (error) {
      res.status(401).json({ error: "Authentication Failed!" })
   }
}


export function localVariables(req, res, next) {
   req.app.locals = {
      OTP: null,
      resetSession: false
   }
   next()
}