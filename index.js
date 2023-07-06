import  express   from "express";
import cors from 'cors';
// import bodyParser from 'body-parser'
// import fileUpload from 'express-fileupload'
// import path from 'path';

import postRoutes from './routers/authRoutes.js';
import productRoutes from "./routers/productRoutes.js";
import dotenv from 'dotenv';

dotenv.config()


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const whitelist = ["http://localhost:3000"]

const corsOptions = {
   origin: function (origin, callback) {
     if (!origin || whitelist.indexOf(origin) !== -1) {
       callback(null, true)
     } else {
       callback(new Error("Not allowed by CORS"))
     }
   },
   credentials: true,
 }
 app.use(cors(corsOptions))
app.use('/api',postRoutes);
app.use('/api/product',productRoutes)

const PORT = process.env.PORT || 5000;

try {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }