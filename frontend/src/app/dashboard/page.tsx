'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Dashboard() {
  const [tasks, setTasks] = useState({ assigned: [], created: [], overdue: [] });
  const router = useRouter();
  
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:5000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${document.cookie.replace('token=', '')}`,
        },
      });

      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'; // Clear auth token
    router.push('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold">Assigned to You</h2>
        <ul className="list-disc ml-5">
          {tasks.assigned.map((task: any) => (
            <li key={task._id}>{task.title}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold">Created by You</h2>
        <ul className="list-disc ml-5">
          {tasks.created.map((task: any) => (
            <li key={task._id}>{task.title}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-red-600">Overdue Tasks</h2>
        <ul className="list-disc ml-5">
          {tasks.overdue.map((task: any) => (
            <li key={task._id}>{task.title}</li>
          ))}
        </ul>
      </section>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
      >
        Logout
      </button>
    </div>
  );
}
