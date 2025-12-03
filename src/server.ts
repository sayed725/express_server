import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";



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

// User Endpoint
app.use("/users", userRoutes);

// Todo Endpoints
app.use("/todos", todoRoutes);






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
