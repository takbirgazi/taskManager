import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  Clock,
  Edit2,
  ListTodo,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Task Management Functions
  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(), // Use timestamp as ID
        text: newTask,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddTask();
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (index, task) => {
    setEditIndex(index);
    setEditTaskText(task.text);
  };

  const saveEditTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, text: editTaskText } : task
      )
    );
    setEditIndex(null);
  };

  // Analytics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "completed") return task.completed;
    if (activeTab === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6 lg:pt-16">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="backdrop-blur-xl md:mt-0 mt-3 bg-white/10 rounded-xl border border-white/20 p-6 transform transition-all duration-300 hover:bg-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <ListTodo size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Tasks</p>
                <h3 className="text-2xl font-bold">{totalTasks}</h3>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-6 transform transition-all duration-300 hover:bg-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Check size={24} className="text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <h3 className="text-2xl font-bold">{completedTasks}</h3>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-6 transform transition-all duration-300 hover:bg-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <h3 className="text-2xl font-bold">{pendingTasks}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Task Management Section */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-6">
          {/* Add Task Input */}
          <div className="mb-6">
            <div className="flex gap-3 flex-col md:flex-row">
              <input
                type="text"
                className="flex-1 bg-black/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border border-white/10"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleAddTask}
                className="py-3 bg-gradient-to-r from-pink-500 to-blue-600 text-white px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-[calc(100vh-350px)]">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="group transform transition-all duration-300"
              >
                <div
                  className={`backdrop-blur-xl rounded-lg border-t-4 shadow-lg 
                  ${
                    task.completed
                      ? "bg-green-500/10 border-green-500/50"
                      : "bg-white/10 border-purple-500/50"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4 mb-3">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          task.completed
                            ? "bg-green-500/80 border-green-400"
                            : "border-white/30 hover:border-purple-400"
                        }`}
                      >
                        {task.completed && <Check size={12} />}
                      </button>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        {editIndex === index ? (
                          <input
                            type="text"
                            className="w-full bg-black/20 text-white p-2 rounded-lg outline-none border border-white/20"
                            value={editTaskText}
                            onChange={(e) => setEditTaskText(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && saveEditTask(task.id)
                            }
                          />
                        ) : (
                          <div>
                            <p
                              className={`text-sm ${
                                task.completed
                                  ? "line-through text-gray-400"
                                  : "text-white"
                              }`}
                            >
                              {task.text}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                              <Calendar size={12} />
                              <span>{task.createdAt}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                      {editIndex === index ? (
                        <button
                          onClick={() => saveEditTask(task.id)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditTask(index, task)}
                          className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white">No tasks found</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === "all"
                  ? "Start by adding a new task above"
                  : `No ${activeTab} tasks found`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;