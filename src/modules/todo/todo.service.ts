import { pool } from "../../config/db";



// Record<string, unknown> = {key: value}
const createTodo = async (payload: Record<string, unknown>) => {
  const { user_id, title } = payload;
  const result = await pool.query(
    `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
    [user_id, title]
  );

  return result;
};


const getTodos = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};



export const todoServices = {
  createTodo,
  getTodos

};

