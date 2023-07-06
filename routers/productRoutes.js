import express from "express";

import {authenticateUser} from "../auth/tokenValidation.js";
import {productList,addProduct} from "../controllers/productController.js";

const router = express.Router();

router.get("/list" ,authenticateUser,productList);
router.post('/add-product',authenticateUser,addProduct);

export default router;