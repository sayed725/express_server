import { Request, Response } from "express";
import { todoServices } from "./todo.service";





const createTodo = async (req: Request, res: Response) => {

  try {
    const result = await todoServices.createTodo(req.body);
    
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
};


const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodos();
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
};



export const todoControllers = {
  createTodo,
  getTodos,
};