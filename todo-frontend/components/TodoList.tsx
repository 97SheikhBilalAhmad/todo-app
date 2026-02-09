"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { Todo, TodosResponse } from "../app/types/todo";
export default function TodoList() {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // 🔹 GET TODOS
  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get<TodosResponse>("/todos");
      return res.data.data;
    },
  });

  // ✅ OPTIMISTIC COMPLETE TOGGLE
  const toggleTodo = useMutation({
    mutationFn: async (todo: Todo) => {
      return api.put(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
    },

    onMutate: async (todo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos =
        queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) =>
          t.id === todo.id
            ? { ...t, completed: !t.completed }
            : t
        )
      );

      return { previousTodos };
    },

    onError: (_err, _todo, context) => {
      queryClient.setQueryData(
        ["todos"],
        context?.previousTodos
      );
      toast.error("Failed to update todo");
    },

    onSuccess: () => {
      toast.success("Todo updated");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // ✏️ UPDATE TITLE
  const updateTodo = useMutation({
    mutationFn: async ({ id, title }: { id: number; title: string }) => {
      return api.put(`/todos/${id}`, { title });
    },
    onSuccess: () => {
      toast.success("Todo updated");
      setEditingId(null);
      setEditTitle("");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  // ❌ DELETE (OPTIMISTIC)
  const deleteTodo = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/todos/${id}`);
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos =
        queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.filter((t) => t.id !== id)
      );

      return { previousTodos };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(
        ["todos"],
        context?.previousTodos
      );
      toast.error("Delete failed");
    },

    onSuccess: () => {
      toast.success("Todo deleted");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) {
    return (
      <p className="text-center text-gray-400">
        Loading todos...
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-center italic text-gray-400">
        No todos yet. Add one 👆
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((todo) => (
        <li
          key={todo.id}
          className={`flex items-center justify-between rounded-xl border p-4
            transition-all duration-200 hover:shadow-md
            ${todo.completed ? "bg-gray-100" : "bg-white"}
          `}
        >
          <div className="flex items-center gap-3 flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo.mutate(todo)}
              className="h-5 w-5 accent-blue-600"
            />

            {editingId === todo.id ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 rounded-lg border p-2
                           focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span
                className={`flex-1 font-medium transition
                  ${
                    todo.completed
                      ? "text-gray-400 line-through"
                      : "text-black"
                  }
                `}
              >
                {todo.title}
              </span>
            )}
          </div>

          <div className="ml-3 flex gap-2">
            {editingId === todo.id ? (
              <>
                <button
                  onClick={() =>
                    updateTodo.mutate({
                      id: todo.id,
                      title: editTitle,
                    })
                  }
                  className="rounded-lg bg-green-500 px-3 py-1
                             text-sm text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded-lg bg-gray-200 px-3 py-1
                             text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditTitle(todo.title);
                  }}
                  className="rounded-lg px-3 py-1 text-sm
                             text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo.mutate(todo.id)}
                  className="rounded-lg px-3 py-1 text-sm
                             text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
