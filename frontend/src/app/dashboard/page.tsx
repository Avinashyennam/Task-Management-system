'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import TaskCard from '../components/Taskcard';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};
import { Task } from '../../../types';
export type TaskForm = {
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Completed'; // or 'Completed' if you changed it
  assignedTo: string;
};


export type TaskCardProps = {
  task: Task;
  editingTaskId: string | null;
  editForm: TaskForm;
  setEditForm: React.Dispatch<React.SetStateAction<TaskForm>>;
  setEditingTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleEditSubmit: (e: React.FormEvent, taskId: string) => void;
  handleDelete: (taskId: string) => void;
};


export default function Dashboard() {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Todo',
    assignedTo: '',
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TaskForm>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Todo',
    assignedTo: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');
  const apiurl = process.env.BACKEND_URL;

  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const headers = getAuthHeaders();
      const [assignedRes, createdRes, overdueRes] = await Promise.all([
        fetch(`${apiurl}/api/auth/assigned`, { headers }),
        fetch(`${apiurl}/api/auth/created`, { headers }),
        fetch(`${apiurl}/api/auth/overdue`, { headers }),
      ]);

      const [assignedData, createdData, overdueData] = await Promise.all([
        assignedRes.json(),
        createdRes.json(),
        overdueRes.json()
      ])

      setAssignedTasks(assignedData.tasks || []);
      setCreatedTasks(createdData.tasks || []);
      setOverdueTasks(overdueData.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === '') {
      router.push("/login");
    }
    fetchTasks();
  }, []);

  const handleLogout = () => {
    // document.cookie = 'token=; Max-Age=0; path=/'; // Clear auth token
    localStorage.removeItem("token");
    router.push('/login');
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    // return;
    try {
      const res = await fetch(`${apiurl}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Task created successfully!');
        setForm({
          title: '',
          description: '',
          dueDate: '',
          priority: 'Low',
          status: 'Todo',
          assignedTo: '',
        });
        fetchTasks();
      } else {
        alert('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiurl}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        alert('Task deleted');
        fetchTasks();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting', err);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiurl}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        alert('Task updated');
        setEditingTaskId(null);
        fetchTasks();
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error('Error updating task', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus ? task.status === filterStatus : true;
      const matchesPriority = filterPriority ? task.priority === filterPriority : true;
      const matchesDueDate = filterDueDate ? new Date(task.dueDate) <= new Date(filterDueDate) : true;

      return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
    });
  };

  const filteredAssigned = filterTasks(assignedTasks);
  const filteredCreated = filterTasks(createdTasks);
  const filteredOverdue = filterTasks(overdueTasks);


  return (
    <div className="flex flex-col h-screen">

      {/* Top Navbar with Logout */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow border-b">
        <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Task List Panel */}
        <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto text-gray-700">

          {/* Filter/Search Bar */}
          <div className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Search by title or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex flex-wrap gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border px-2 py-1 rounded">
                <option value="">All Status</option>
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border px-2 py-1 rounded">
                <option value="">All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <input
                type="date"
                value={filterDueDate}
                onChange={(e) => setFilterDueDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">assigned tasks</h2>
            {filteredAssigned.map((task: Task) => (
              <TaskCard
                key={task._id}
                task={task}
                editingTaskId={editingTaskId}
                editForm={editForm}
                setEditForm={setEditForm}
                setEditingTaskId={setEditingTaskId}
                handleEditChange={handleEditChange}
                handleEditSubmit={handleEditSubmit}
                handleDelete={handleDelete}
              />
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">created tasks</h2>
            {filteredCreated.map((task: Task) => (
              <TaskCard
                key={task._id}
                task={task}
                editingTaskId={editingTaskId}
                editForm={editForm}
                setEditForm={setEditForm}
                setEditingTaskId={setEditingTaskId}
                handleEditChange={handleEditChange}
                handleEditSubmit={handleEditSubmit}
                handleDelete={handleDelete}
              />
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">overdue tasks</h2>
            {filteredOverdue.map((task: Task) => (
              <TaskCard
                key={task._id}
                task={task}
                editingTaskId={editingTaskId}
                editForm={editForm}
                setEditForm={setEditForm}
                setEditingTaskId={setEditingTaskId}
                handleEditChange={handleEditChange}
                handleEditSubmit={handleEditSubmit}
                handleDelete={handleDelete}
              />
            ))}
          </div>

        </div>

        {/* Task Creation Panel */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/2 p-6 bg-gradient-to-br from-white via-blue-50 to-purple-100 border-l border-gray-200 text-gray-800 shadow-xl"
        >
          <h2 className="text-2xl font-extrabold mb-6 text-blue-700 tracking-wide">Create New Task</h2>

          <form onSubmit={handleCreateTask} className="space-y-5">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <input
              type="text"
              name="assignedTo"
              placeholder="Assign to (user email)"
              value={form.assignedTo}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Task
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
