import api from '@/lib/axios';

export const getTodos = async () => {
  const res = await api.get('/todos');
  return res.data;
};

export const createTodo = async (data: any) => {
  const res = await api.post('/todos', data);
  return res.data;
};

export const updateTodo = async ({ id, data }: any) => {
  const res = await api.put(`/todos/${id}`, data);
  return res.data;
};

export const deleteTodo = async (id: string) => {
  const res = await api.delete(`/todos/${id}`);
  return res.data;
};
