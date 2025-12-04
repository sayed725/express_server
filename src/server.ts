import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";



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

// auth Endpoints
app.use("/auth", authRoutes);




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
