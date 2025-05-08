export type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Completed';
  assignedTo: string;
  createdBy?: string;        // optional, if used
  createdAt?: string;        // optional, if returned by backend
  updatedAt?: string;        // optional, if returned by backend
};
