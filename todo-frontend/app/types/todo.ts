export interface Todo {
  completed: any;
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

export interface TodosResponse {
  message: string;
  data: Todo[];
}
