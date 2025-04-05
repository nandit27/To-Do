'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { todoService, type Todo } from "@/services/todoService";
import { Trash2Icon } from "lucide-react";

interface TodoEditorSectionProps {
  selectedTodo: Todo | null;
  onTodoDelete: (todoId: string) => void;
  onTodoUpdate: (todo: Todo) => void;
}

export const TodoEditorSection = ({
  selectedTodo,
  onTodoDelete,
  onTodoUpdate,
}: TodoEditorSectionProps): JSX.Element => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTodo) {
      setTitle(selectedTodo.title);
      setDescription(selectedTodo.description);
      if (titleRef.current) titleRef.current.innerText = selectedTodo.title;
      if (descriptionRef.current) descriptionRef.current.innerText = selectedTodo.description;
    }
  }, [selectedTodo]);

  const handleTitleChange = async () => {
    if (!selectedTodo || !titleRef.current) return;
    const newTitle = titleRef.current.innerText.trim();
    if (newTitle === title) return;

    try {
      setSaving(true);
      const updatedTodo = await todoService.updateTodo(selectedTodo._id, {
        title: newTitle,
        description: selectedTodo.description,
      });
      setTitle(newTitle);
      onTodoUpdate(updatedTodo);
    } catch (error) {
      console.error('Error updating todo title:', error);
      // Revert changes on error
      if (titleRef.current) titleRef.current.innerText = title;
    } finally {
      setSaving(false);
    }
  };

  const handleDescriptionChange = async () => {
    if (!selectedTodo || !descriptionRef.current) return;
    const newDescription = descriptionRef.current.innerText.trim();
    if (newDescription === description) return;

    try {
      setSaving(true);
      const updatedTodo = await todoService.updateTodo(selectedTodo._id, {
        title: selectedTodo.title,
        description: newDescription,
      });
      setDescription(newDescription);
      onTodoUpdate(updatedTodo);
    } catch (error) {
      console.error('Error updating todo description:', error);
      // Revert changes on error
      if (descriptionRef.current) descriptionRef.current.innerText = description;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTodo) return;
    try {
      await todoService.deleteTodo(selectedTodo._id);
      onTodoDelete(selectedTodo._id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (!selectedTodo) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex items-center justify-center h-full text-gray-500">
          Select a todo to edit or create a new one
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full relative">
      <CardContent className="p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <div
            ref={titleRef}
            contentEditable
            onBlur={handleTitleChange}
            className="text-2xl font-semibold outline-none border-b-2 border-transparent focus:border-primary transition-colors"
            suppressContentEditableWarning
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            className="shrink-0"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={descriptionRef}
          contentEditable
          onBlur={handleDescriptionChange}
          className="flex-grow outline-none border-2 border-transparent focus:border-primary rounded-md transition-colors p-2"
          suppressContentEditableWarning
        />
        {saving && (
          <div className="absolute bottom-4 right-4 text-sm text-gray-500">
            Saving...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
