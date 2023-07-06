import multer from "multer";
import path  from 'path';
import fs from 'fs/promises'; // Import the 'fs' module

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {getProduct,addProducts} from "../models/productModel.js"

export const productList = async(req,res) =>{
  try{
    const list = await getProduct();
    res.status(200).json({data:list})
  }
  catch(error){
    res.status(500).json({message:error})
  }
}
// Create a Multer instance with desired configuration
const upload = multer({ dest: 'uploads/' });

export const addProduct = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Image upload failed' });
      }
      const created_by = req.userId;

      const { product_name, product_quantity, price, description, category_id } = req.body;
      const image = req.file;

      console.log("req.body",req.body,"req.file",req.file.path);

      // Perform validation and data processing as needed

       // Move the uploaded image file to the desired destination
       const imagePath = path.join(__dirname, '..', 'public/images/upload_images', image.originalname);
       console.log(image.originalname);
       await fs.rename(image.path, imagePath);
       console.log("imagePath",imagePath);

      // Call the addProducts function with the data
      const result = await addProducts({
        product_name,
        product_quantity,
        price,
        created_by,
        image: imagePath,
        description,
        category_id,
      });

    //   console.log(result);

      // Send response
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const addProduct = async (req, res) => {
//   try {
//     upload.array('image', 5)(req, res, async (err) => {

//       if (err) {
        
//         return res.status(400).json({ message: err });
//       }
//       const created_by = req.userId;

//       const { product_name, product_quantity, price, description, category_id } = req.body;
//       const images = req.files;


//       // Perform validation and data processing as needed

//       // Move the uploaded image files to the desired destination
//       const imagePaths = [];
//       for (const image of images) {
//         const imagePath = path.join(__dirname, '..', 'public/images/upload_images', image.originalname);
//         await fs.rename(image.path, imagePath);
//         imagePaths.push(image.originalname);
//       }

//       const categoryID =  parseInt(category_id)

//       // Call the addProducts function with the data
//       const result = await addProducts({
//         product_name,
//         product_quantity,
//         price,
//         created_by,
//         image: imagePaths,
//         category_id:categoryID,
//         description,
//       });

//       // Send response
//       console.log("log",result);
//       if(result)  res.status(200).json(result);
//       else res.status(500).json(result)
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
