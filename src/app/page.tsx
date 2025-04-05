'use client';

import { useState, useCallback } from 'react';
import { TodoEditorSection } from "@/components/sections/TodoEditorSection";
import { TodoListSection } from "@/components/sections/TodoListSection";
import type { Todo } from "@/services/todoService";

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleTodoSelect = useCallback((todo: Todo) => {
    setSelectedTodo(todo);
  }, []);

  const handleTodoDelete = useCallback((id: string) => {
    setSelectedTodo(null);
  }, []);

  const handleTodoUpdate = useCallback((updatedTodo: Todo) => {
    setSelectedTodo(updatedTodo);
  }, []);

  return (
    <main className="bg-[#f4f4f4] flex justify-center w-full min-h-screen">
      <div className="bg-[#f4f4f4] w-full max-w-[1353px] flex flex-col">
        <header className="w-full h-[88px] bg-white border-b border-solid border-gray-200">
          <div className="h-full flex items-center px-16">
            <div className="flex items-center gap-2">
              <img
                className="w-[32px] h-[30px]"
                alt="Todo logo"
                src="/frame-1.svg"
              />
              <h1 className="font-bold text-[25px] text-black">TODO</h1>
            </div>
          </div>
        </header>

        <div className="flex flex-row gap-[72px] p-16 pt-14">
          <div className="w-[30%]">
            <TodoListSection 
              onTodoSelect={handleTodoSelect}
              selectedTodoId={selectedTodo?._id}
            />
          </div>
          <div className="w-[48%]">
            <TodoEditorSection
              selectedTodo={selectedTodo}
              onTodoDelete={handleTodoDelete}
              onTodoUpdate={handleTodoUpdate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
