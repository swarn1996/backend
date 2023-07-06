import pool from "../database.js";
import { promisify } from "util";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getConnection = promisify(pool.getConnection).bind(pool);
const query = promisify(pool.query).bind(pool);

export const getUser = async () => {
  try {
    const connection = await getConnection();
    const results = await query("SELECT * FROM user");
    connection.release();

    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const checkEmailExists = async (email) => {
  try {
    const connection = await getConnection();
    const queryResult = await query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    connection.release();

    return queryResult.length > 0;
  } catch (error) {
    throw error;
  }
};
export const checkRole = async (id) => {
    try {
      const connection = await getConnection();
      const queryResult = await query("SELECT * FROM user WHERE id = ?", [
        id,
      ]);
      connection.release();
  
      return queryResult;
    } catch (error) {
      throw error;
    }
  };

export const createUser = async (data) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const queryResult = await query(
      `insert into user(role_id,username,email,password,phone_number) value(?,?,?,?,?)`,
      [
        data.role_id,
        data.username,
        data.email,
        hashedPassword,
        data.phone_number,
      ]
    );

    const userId = queryResult.insertId;
    if (userId > 0) {
      // Data successfully inserted
      return { status: "success", message: "User created successfully" };
    } else {
      // Failed to insert data
      return { status: "error", message: "Failed to create user" };
    }
  } catch (error) {
    return error;
  }
};

export const updateUser = async (data) => {
  try {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    console.log("i am in model", data);
    const connection = await getConnection();
    const updateQuery = await query(
      `UPDATE user SET username=?, email=?,password=?,phone_number=?  WHERE id = ?`,
      [data.username, data.email, hashedPassword, data.phone_number, data.id]
    );

    connection.release();
    if (updateQuery.changedRows > 0) {
      return { status: "success", message: "User created successfully" };
    } else {
      // Failed to insert data
      return { status: "error", message: "Failed to create user" };
    }
  } catch (error) {
    return error;
  }
};
export const deleteUser = async (id) => {
  try {
    const connection = await getConnection();
    const queryResult = await query("DELETE FROM user where id = ? ", [id]);

    connection.release();
    return queryResult;
  } catch (error) {
    return error;
  }
};
export const getUserById = async (id) => {
  try {
  } catch (error) {
    return error;
  }
};

export const getUserByEmail = async (data) => {
  try {
    const email = data.email;
    const connection = await getConnection();
    const queryResult = await query("SELECT * FROM USER WHERE email = ?", [
      email,
    ]);
    connection.release();

    return queryResult[0];
  } catch (error) {
    return error;
  }
};
