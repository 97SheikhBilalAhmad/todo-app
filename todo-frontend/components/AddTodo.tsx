"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function AddTodo() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const addTodo = useMutation({
    mutationFn: async () => {
      return api.post("/todos", { title });
    },
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div className="mb-6 flex gap-2">
      <input
        className="flex-1 rounded-lg border border-gray-300 p-3 text-black 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="✍️ Write a new todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => addTodo.mutate()}
        className="rounded-lg bg-blue-600 px-5 py-3 
                   text-white font-semibold hover:bg-blue-700 
                   active:scale-95 transition"
      >
        Add
      </button>
    </div>
  );
}
