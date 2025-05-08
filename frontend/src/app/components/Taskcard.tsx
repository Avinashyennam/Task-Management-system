// components/TaskCard.tsx
import { Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { TaskCardProps } from "../dashboard/page";

// type Task = {
//   _id: string;
//   title: string;
//   description: string;
//   dueDate: string;
//   priority: string;
//   status: string;
// };

// type Props = {
//   task: Task;
//   editingTaskId: string | null;
//   editForm: Partial<Task>;
//   setEditForm: React.Dispatch<React.SetStateAction<Partial<Task>>>;
//   setEditingTaskId: (id: string | null) => void;
//   handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
//   handleEditSubmit: (e: React.FormEvent, id: string) => void;
//   handleDelete: (id: string) => void;
// };

const priorityColor = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-700",
};

const statusColor = {
  "Todo": "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed": "bg-emerald-100 text-emerald-700",
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  editingTaskId,
  editForm,
  setEditForm,
  setEditingTaskId,
  handleEditChange,
  handleEditSubmit,
  handleDelete
}) => {
  const isEditing = editingTaskId === task._id;
  // return (
  //   <div className="bg-white p-4 rounded shadow mb-3">
  //     {editingTaskId === task._id ? (
  //       <form onSubmit={(e) => handleEditSubmit(e, task._id)} className="space-y-2">
  //         <input name="title" value={editForm.title || ""} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
  //         <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
  //         <input type="date" name="dueDate" value={editForm.dueDate?.split('T')[0] || ""} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
  //         <select name="priority" value={editForm.priority || "Low"} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
  //           <option>Low</option><option>Medium</option><option>High</option>
  //         </select>
  //         <select name="status" value={editForm.status || "Todo"} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
  //           <option>Todo</option><option>In Progress</option><option>Completed</option>
  //         </select>
  //         <div className="flex gap-2">
  //           <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
  //           <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditingTaskId(null)}>Cancel</button>
  //         </div>
  //       </form>
  //     ) : (
  //       <>
  //         <h3 className="text-lg font-semibold">{task.title}</h3>
  //         <p>{task.description}</p>
  //         <p className="text-sm text-gray-600">Due: {task.dueDate?.split('T')[0]}</p>
  //         <p className="text-sm">Priority: {task.priority}</p>
  //         <p className="text-sm">Status: {task.status}</p>
  //         <div className="flex gap-2 mt-2">
  //           <button onClick={() => {
  //             setEditingTaskId(task._id);
  //             setEditForm(task);
  //           }}>
  //             <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
  //           </button>
  //           <button onClick={() => handleDelete(task._id)}>
  //             <Trash2 size={18} className="text-red-600 hover:text-red-800" />
  //           </button>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );

  return (
    <AnimatePresence>
      <motion.div
        key={task._id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-4 m-2 rounded-2xl shadow hover:shadow-md transition-shadow duration-200 border border-gray-200"
      >
        {isEditing ? (
          <motion.form
            onSubmit={(e) => handleEditSubmit(e, task._id)}
            layout
            className="space-y-3"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <input
              name="title"
              value={editForm.title || ""}
              onChange={handleEditChange}
              placeholder="Title"
              className="w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="description"
              value={editForm.description || ""}
              onChange={handleEditChange}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="date"
              name="dueDate"
              value={editForm.dueDate?.split("T")[0] || ""}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-4">
              <select
                name="priority"
                value={editForm.priority || "Low"}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <select
                name="status"
                value={editForm.status || "Todo"}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500 transition"
                onClick={() => setEditingTaskId(null)}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        ) : (
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1 text-gray-800">{task.title}</h3>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <p className="text-sm text-gray-500 mb-1">Due: {task.dueDate?.split("T")[0]}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor[task.priority as keyof typeof priorityColor]}`}>
                  {task.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[task.status as keyof typeof statusColor]}`}>
                  {task.status}
                </span>
              </div>
            </div>

            <div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    setEditingTaskId(task._id);
                    setEditForm({
                      title: task.title,
                      description: task.description,
                      dueDate: task.dueDate,
                      priority: task.priority,
                      status: task.status,
                      assignedTo: task.assignedTo,
                    });
                    
                  }}
                  className="hover:scale-110 transition-transform"
                >
                  <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="hover:scale-110 transition-transform"
                >
                  <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                </button>
              </div>
            </div>
            {/* <h3 className="text-xl font-bold mb-1 text-gray-800">{task.title}</h3>
            <p className="text-gray-600 mb-2">{task.description}</p>
            <p className="text-sm text-gray-500 mb-1">Due: {task.dueDate?.split("T")[0]}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor[task.priority as keyof typeof priorityColor]}`}>
                {task.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[task.status as keyof typeof statusColor]}`}>
                {task.status}
              </span>
            </div> */}
            {/* <div className="flex gap-3 mt-3">
              <button
                onClick={() => {
                  setEditingTaskId(task._id);
                  setEditForm(task);
                }}
                className="hover:scale-110 transition-transform"
              >
                <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="hover:scale-110 transition-transform"
              >
                <Trash2 size={18} className="text-red-600 hover:text-red-800" />
              </button>
            </div> */}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskCard;
