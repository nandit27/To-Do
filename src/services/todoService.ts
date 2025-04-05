const API_URL = 'http://localhost:5001/api/todos';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodosResponse {
  todos: Todo[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface UpdateTodoData {
  title: string;
  description: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const todoService = {
  async createTodo(title: string, description: string): Promise<Todo> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  async getTodos(page: number = 1, limit: number = 10): Promise<TodosResponse> {
    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  async getTodo(id: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    return response.json();
  },

  async updateTodo(id: string, data: UpdateTodoData): Promise<Todo> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },
}; 