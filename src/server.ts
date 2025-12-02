import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";



const app = express();
const port = config.port;

// parser
app.use(express.json());
// app.use(express.urlencoded())


// initialize database
initDB();



// Root Endpoint
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next level developers!");
});

// User  Creation Endpoint
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );
    // console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Data inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// User get Endpoint
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// User get by id Endpoint
app.get("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// User update by id Endpoint
app.put("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const { name, email, age, phone, address } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// User delete by id Endpoint
app.delete("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id);
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id=$1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// todo creation crud endpoint
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title, description, due_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: "Todos created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// todo get all endpoint
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// todo get by id endpoint
app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todos not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// todo update by id endpoint
app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE todos SET title=$1 WHERE id=$2 RETURNING *`,
      [title, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todos not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Todos updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// todo delete by id endpoint
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM todos WHERE id=$1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Todos not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Todos deleted successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// not-found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
