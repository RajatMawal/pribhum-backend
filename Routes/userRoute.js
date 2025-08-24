import express from "express"
import { deleteUser, findAllUser, forgotPassword, getAccess, getUser, login, logoutUser, otpVerify, register, updatePassword, updateRole} from "../Controller/userController.js"
import { auth} from "../Middleware/auth.js"


const user = express.Router()

user.post("/register",register)
user.post("/login",login)
user.get("/profile",auth,getUser)
user.get("/allUsers",auth,findAllUser)
user.get("/logoutUser",auth,logoutUser)
user.get("/getAccess",auth,getAccess)
user.post("/forgotPassword",forgotPassword)
user.post("/otp-verify",otpVerify)
user.delete("/delete-user/:id",auth,deleteUser)
user.patch("/update-role/:id",auth,updateRole)
user.post("/updatePassword",updatePassword)

export default user