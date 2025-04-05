import express from 'express';
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';

const router = express.Router();

router.post('/', createTodo);
router.get('/', getTodos);
router.get('/:id', getTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router; 