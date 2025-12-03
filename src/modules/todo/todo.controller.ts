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

const getSingleTodo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await todoServices.getSingleTodo(id as string);
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
};

const updateTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.updateTodo(req.body, req.params.id!);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await todoServices.deleteTodo(id as string);
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
};

export const todoControllers = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
