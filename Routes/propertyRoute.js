import express from "express"
import { upload } from "../Middleware/Multer.js"
import { addProperty, allProperty, bookingForm, deleteProperty,propertyFind} from "../Controller/propertyController.js"
import { auth } from "../Middleware/auth.js"

const propertyRoute = express.Router()

propertyRoute.post("/add-property",upload.array("Images",4),auth,addProperty)
propertyRoute.delete("/delete-property/:id",auth,deleteProperty)
propertyRoute.get("/",allProperty)
propertyRoute.get("/details/:id",propertyFind)
propertyRoute.post("/enquiry",auth,bookingForm)




export default propertyRoute