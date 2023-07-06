import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {
  getUser,
  createUser,
  checkEmailExists,
  getUserByEmail,
  updateUser,
  deleteUser,
  checkRole
} from "../models/userModal.js";



export const getUsers = async (req, res) => {
  try {
    const getUserData = await getUser();
    res.status(200).json(getUserData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserByID = async (req,res) =>{
try{
    const id = req.params.id
    const  userID = req.userId;
    const connection = await checkRole(userID);
    console.log(connection);
    res.status(200).json({success:1,data:connection})
}
catch(error){}
}

export const addNewUser = async (req, res) => {
  try {
    const body = req.body;
    const { email, password, phone_number } = body;

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password should be at least 8 characters long" });
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if email already exists
    const userExists = await checkEmailExists(email);
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const createUserResponse = await createUser(body);
    res.status(201).json(createUserResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const body = req.body;
    const getCurrentUser = await getUserByEmail(body);

    if (getCurrentUser === undefined) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(
      body.password,
      getCurrentUser.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    let token = jwt.sign({ userId: getCurrentUser.id }, 'secretKey', {
        expiresIn: '12h', // Set token expiration time as desired
      });

    // Password is correct, perform additional actions if needed

    res.status(200).json({ message: "Login successful" ,token:token});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCurrentUser = async (req,res) =>{
    try{
        const body = req.body;

        const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password should be at least 8 characters long" });
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
        const response  = await updateUser(body);

        res.status(200).json({ message: "data updated success" ,data:response});
    }
    catch(error){
    res.status(500).json({success:0, message:error})
    }
}

export const deleteUserById = async (req, res) => {
    try {
      const id = req.params.id; // Get the ID from the request parameters

      const currentUserId = req.userId;

      if(id == currentUserId )  
      {
        const deleteResult = await deleteUser(id); // Call the deleteUser function passing the ID

        if (deleteResult.affectedRows > 0) {
          // User deleted successfully
          res.status(200).json({ message: 'User deleted successfully' });
        } else {
          // User with the specified ID not found
          res.status(404).json({ message: 'User not found' });
        }
      }else{
        res.status(404).json({ message: 'User is not authorized to delete the account' });

      }
      
      
      
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the user' });
    }
  };
  