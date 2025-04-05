'use client';

import { PlusIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { todoService, type Todo, type TodosResponse } from "@/services/todoService";

interface TodoListSectionProps {
  onTodoSelect: (todo: Todo) => void;
  selectedTodoId?: string | null;
}

export const TodoListSection = ({ 
  onTodoSelect,
  selectedTodoId 
}: TodoListSectionProps): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTodos = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response: TodosResponse = await todoService.getTodos(page);
      setTodos(response.todos);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      
      // If we have a selected todo, make sure it's still in the list
      if (selectedTodoId && !response.todos.find(t => t._id === selectedTodoId)) {
        onTodoSelect(response.todos[0]);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTodoId, onTodoSelect]);

  // Refresh todos when page changes
  useEffect(() => {
    fetchTodos(currentPage);
  }, [currentPage, fetchTodos]);

  const handleCreateTodo = async () => {
    try {
      const newTodo = await todoService.createTodo(
        "New Todo",
        "Click to edit this todo"
      );
      // Add the new todo to the beginning of the list
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      // Select the new todo
      onTodoSelect(newTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleTodoClick = (todo: Todo) => {
    onTodoSelect(todo);
  };

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="flex flex-col items-start gap-4 w-full">
      <div className="flex w-full max-w-[401px] items-center justify-between">
        <Button
          variant="default"
          className="h-12 gap-2 px-4 py-3 bg-black rounded-lg"
          onClick={handleCreateTodo}
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium text-sm [font-family:'Poppins',Helvetica]">
            TODO
          </span>
        </Button>

        <div className="relative">
          <input
            type="text"
            placeholder="Search todos..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-col items-start gap-[15px] w-full">
        {loading ? (
          <div className="w-full text-center py-4">Loading...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="w-full text-center py-4 text-gray-500">
            {searchQuery ? "No todos found" : "No todos yet"}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo._id} className="inline-flex items-center gap-4 w-full">
              <Card
                className={`w-full max-w-[401px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                  todo._id === selectedTodoId ? "border-2 border-black" : "border border-[#e5e3e3]"
                }`}
                onClick={() => handleTodoClick(todo)}
              >
                <CardContent className="p-4 flex flex-col items-start justify-center gap-2">
                  <div className="flex flex-col items-start justify-center w-full">
                    <h3 className="w-full font-semibold text-[#1b1b1b] text-lg tracking-[0.36px] [font-family:'Poppins',Helvetica] mt-[-1px]">
                      {todo.title}
                    </h3>

                    <div className="flex w-full items-center justify-between">
                      <div className="flex flex-wrap w-[269px] items-center gap-[8px] py-2">
                        <p className="w-full text-[#000000cc] text-sm [font-family:'Poppins',Helvetica] font-normal leading-[19px] mt-[-1px] line-clamp-2">
                          {todo.description}
                        </p>
                      </div>

                      <time className="text-[#00000080] text-xs text-center [font-family:'Poppins',Helvetica] font-normal leading-[19px] whitespace-nowrap">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 w-full">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
};
