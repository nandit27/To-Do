import { Request, Response } from 'express';
import { Todo } from '../models/Todo';

// Create a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({
      title,
      description,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error });
  }
};

// Get todos with pagination
export const getTodos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments();

    res.json({
      todos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

// Get a single todo
export const getTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo', error });
  }
};

// Update a todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
}; 