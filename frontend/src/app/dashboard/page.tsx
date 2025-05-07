'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
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
  const [editForm, setEditForm] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const headers = getAuthHeaders();

        const [assignedRes, createdRes, overdueRes] = await Promise.all([
          fetch('http://localhost:5000/api/auth/assigned', { headers }),
          fetch('http://localhost:5000/api/auth/created', { headers }),
          fetch('http://localhost:5000/api/auth/overdue', { headers }),
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

    fetchTasks();
  }, []);

  const handleLogout = () => {
    // document.cookie = 'token=; Max-Age=0; path=/'; // Clear auth token
    localStorage.removeItem("token");
    router.push('/login');
  };

  const handleCreateTask = async (e: any) => {
    e.preventDefault();
    console.log(form);
    // return;
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
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
        // fetchAssignedTasks();
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
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        alert('Task deleted');
        // fetchAssignedTasks(); // refresh
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting', err);
    }
  };

  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: any, taskId: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        alert('Task updated');
        setEditingTaskId(null);
        // fetchAssignedTasks();
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error('Error updating task', err);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen">
      {/* Task List Panel */}
      <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto text-gray-700">
        <div>
          <h2 className="text-xl font-bold mb-4">assigned tasks</h2>
          {assignedTasks.map((task: any) => (
            <div key={task._id} className="bg-white p-4 rounded shadow mb-3">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">Due: {task.dueDate?.split('T')[0]}</p>
              <p className="text-sm">Priority: {task.priority}</p>
              <p className="text-sm">Status: {task.status}</p>
              <button onClick={() => {
                setEditingTaskId(task._id);
                setEditForm(task);
              }}>
                <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
              </button>
              <button onClick={() => handleDelete(task._id)}>
                <Trash2 size={18} className="text-red-600 hover:text-red-800" />
              </button>

              {/* {editingTaskId === task._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, task._id)} className="space-y-2">
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                  <input type="date" name="dueDate" value={editForm.dueDate?.split('T')[0]} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                  <select name="priority" value={editForm.priority} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                  <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
                    <option>Pending</option><option>In Progress</option><option>Completed</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditingTaskId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="text-sm text-gray-600">Due: {task.dueDate?.split('T')[0]}</p>
                  <p className="text-sm">Priority: {task.priority}</p>
                  <p className="text-sm">Status: {task.status}</p>

                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => {
                      setEditingTaskId(task._id);
                      setEditForm(task);
                    }}>
                      <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => handleDelete(task._id)}>
                      <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </>
              )} */}

            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">created tasks</h2>
          {createdTasks.map((task: any) => (
            <div key={task._id} className="bg-white p-4 rounded shadow mb-3">
              {/* <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">Due: {task.dueDate?.split('T')[0]}</p>
              <p className="text-sm">Priority: {task.priority}</p>
              <p className="text-sm">Status: {task.status}</p>

              <button onClick={() => {
                setEditingTaskId(task._id);
                setEditForm(task);
              }}>
                <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
              </button>
              <button onClick={() => handleDelete(task._id)}>
                <Trash2 size={18} className="text-red-600 hover:text-red-800" />
              </button> */}

              {editingTaskId === task._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, task._id)} className="space-y-2">
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                  <input type="date" name="dueDate" value={editForm.dueDate?.split('T')[0]} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
                  <select name="priority" value={editForm.priority} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                  <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
                    <option>Todo</option><option>In Progress</option><option>Completed</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditingTaskId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="text-sm text-gray-600">Due: {task.dueDate?.split('T')[0]}</p>
                  <p className="text-sm">Priority: {task.priority}</p>
                  <p className="text-sm">Status: {task.status}</p>

                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingTaskId(task._id);
                      setEditForm(task);
                    }}>
                      <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => handleDelete(task._id)}>
                      <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">overdue tasks</h2>
          {overdueTasks.map((task: any) => (
            <div key={task._id} className="bg-white p-4 rounded shadow mb-3">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">Due: {task.dueDate?.split('T')[0]}</p>
              <p className="text-sm">Priority: {task.priority}</p>
              <p className="text-sm">Status: {task.status}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Task Creation Panel */}
      <div className="w-1/2 p-6 bg-white border-l border-gray-200 text-gray-700">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select name="priority" value={form.priority} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
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
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div className="p-6">
  //     <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

  //     <section className="mb-8">
  //       <h2 className="text-lg font-semibold">Assigned to You</h2>
  //       <ul className="list-disc ml-5">
  //         {assignedTasks.map((task: any) => (
  //           <li key={task._id}>{task.title}</li>
  //         ))}
  //       </ul>
  //     </section>

  //     <section className="mb-8">
  //       <h2 className="text-lg font-semibold">Created by You</h2>
  //       <ul className="list-disc ml-5">
  //         {createdTasks.map((task: any) => (
  //           <li key={task._id}>{task.title}</li>
  //         ))}
  //       </ul>
  //     </section>

  //     <section>
  //       <h2 className="text-lg font-semibold text-red-600">Overdue Tasks</h2>
  //       <ul className="list-disc ml-5">
  //         {overdueTasks.map((task: any) => (
  //           <li key={task._id}>{task.title}</li>
  //         ))}
  //       </ul>
  //     </section>

  //     <button
  //       onClick={handleLogout}
  //       className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
  //     >
  //       Logout
  //     </button>
  //   </div>
  // );
}
