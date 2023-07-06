import express from "express";

import {getUsers,addNewUser,login,updateCurrentUser,deleteUserById,getUserByID} from "../controllers/authController.js";
import {authenticateUser} from "../auth/tokenValidation.js"

const router = express.Router();


router.get("/",authenticateUser ,getUsers);
router.get("/getuser/:id",authenticateUser ,getUserByID)
router.post("/add-user",addNewUser);
router.patch("/update-user",authenticateUser, updateCurrentUser)
router.delete("/delete/:id",authenticateUser, deleteUserById);


router.post("/login",login);

export default router;