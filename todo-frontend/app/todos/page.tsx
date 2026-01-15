"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Todo {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

interface TodosResponse {
  message: string;
  data: Todo[];
}

export default function TodosPage() {
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");


  // 🔐 Auth check + fetch todos
  useEffect(() => {
    const token = localStorage.getItem("token");
    //console.log("Token:", token);

    if (!token) {
      router.replace("/login");
      return;
    }

    fetchTodos();
  }, []);

  // 📥 Fetch Todos
  const fetchTodos = async () => {
    try {
      const res = await api.get<TodosResponse>("/todos");
      setTodos(res.data.data); // ✅ IMPORTANT FIX
    } catch (err) {
      console.log("Fetch todos failed");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add Todo
  const addTodo = async () => {
    if (!title.trim()) return;

    await api.post("/todos", { title });
    setTitle("");
    fetchTodos();
  };


const updateTodo = async (id: number) => {
  if (!editTitle.trim()) return;

  await api.put(`/todos/${id}`, {
    title: editTitle,
  });

  setEditingId(null);
  setEditTitle("");
  fetchTodos();
};




  // ❌ Delete Todo
  const deleteTodo = async (id: number) => {
    await api.delete(`/todos/${id}`);
    fetchTodos();
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return <p className="p-6">Loading todos...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-xl rounded bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">My Todos</h1>
          <button
            onClick={logout}
            className="rounded bg-red-500 px-3 py-1 text-white"
          >
            Logout
          </button>
        </div>

        {/* Add Todo */}
        <div className="mb-4 flex gap-2">
          <input
            className="flex-1 rounded border p-2 text-black"
            placeholder="New todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="rounded bg-blue-600 px-4 text-white"
          >
            Add
          </button>
        </div>

        {/* Todos List */}
        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
  key={todo.id}
  className="flex items-center justify-between rounded border p-2"
>
  {editingId === todo.id ? (
    <input
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      className="flex-1 rounded border p-1 mr-2 text-black"
    />
  ) : (
    <span className="text-black">{todo.title}</span>
  )}

  <div className="flex gap-2">
    {editingId === todo.id ? (
      <button
        onClick={() => updateTodo(todo.id)}
        className="text-green-600"
      >
        Save
      </button>
    ) : (
      <button
        onClick={() => {
          setEditingId(todo.id);
          setEditTitle(todo.title);
        }}
        className="text-blue-600"
      >
        Edit
      </button>
    )}

    <button
      onClick={() => deleteTodo(todo.id)}
      className="text-red-500"
    >
      Delete
    </button>
  </div>
</li>

            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
