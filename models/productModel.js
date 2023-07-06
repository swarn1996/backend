import pool from "../database.js";
import { promisify } from "util";

const getConnection = promisify(pool.getConnection).bind(pool);
const query = promisify(pool.query).bind(pool);

export const getProduct = async () => {
  try {
    const connection = await getConnection();
    const queryResult = await query("SELECT * FROM product");
    connection.release();
    return queryResult;
  } catch (error) {
    return error;
  }
};

export const addProducts = async (data) => {
  try {

    console.log("data",data);

    const connection = await getConnection();

    const queryResult = await query(
        "INSERT INTO product (product_name, product_quantity, price, created_by, image, description, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
        data.product_name,
        data.product_quantity,
        data.price,
        data.created_by,
        JSON.stringify(data.image),
        data.description,
        data.category_id,
      ]
    );
    connection.release();
    console.log('queryResult',queryResult);
    const productId = queryResult.insertId;
    console.log("productId",productId);
    if (productId > 0) {
      // Data successfully inserted
      return { status: "success", message: "Product created successfully" };
    } else {
      // Failed to insert data
      return { status: "error", message: "Failed to create Product" };
    }
  } catch (error) {
    return error;
  }
};
