
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Todo {
  id: number;
  title: string;
}

interface TodosResponse {
  data: Todo[];
}

export default function TodosPage() {
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // 🔐 Auth + fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
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
      setTodos(res.data.data);
    } catch (err) {
      console.log("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add
  const addTodo = async () => {
    if (!title.trim()) return;
    await api.post("/todos", { title });
    setTitle("");
    fetchTodos();
  };

  // ✏️ Update
  const updateTodo = async (id: number) => {
    if (!editTitle.trim()) return;

    await api.put(`/todos/${id}`, { title: editTitle });
    setEditingId(null);
    setEditTitle("");
    fetchTodos();
  };

  // ❌ Delete
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
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-gray-600">
        Loading your todos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-100 to-pink-300 flex items-center p-6">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-300 to-pink-600 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800">
            📝 My Todo App
          </h1>
          <button
            onClick={logout}
            className="rounded-lg bg-red-500 px-4 py-1 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Add Todo */}
        <div className="mb-6 flex gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-600 px-4 py-2 text-black focus:border-black focus:outline-none"
            placeholder="What do you want to do today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="rounded-xl bg-gradient-to-br from-indigo-600 to-pink-600 px-5 py-2 font-semibold text-white hover:bg-gray-700"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">
            No todos yet. Add one 🚀
          </p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm hover:bg-white"
              >
                {editingId === todo.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mr-3 flex-1 rounded-lg border px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-800">
                    {todo.title}
                  </span>
                )}

                <div className="flex gap-3">
                  {editingId === todo.id ? (
                    <button
                      onClick={() => updateTodo(todo.id)}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditTitle(todo.title);
                      }}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:underline"
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
