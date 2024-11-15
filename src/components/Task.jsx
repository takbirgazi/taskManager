import { useState, useEffect } from "react";
import {
    Calendar,
    Check,
    Edit2,
    Plus,
    Save,
    Trash2,
    Search,
    Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editTaskText, setEditTaskText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortCriteria, setSortCriteria] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");

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
                id: Date.now(),
                text: newTask,
                completed: false,
                createdAt: new Date().toLocaleDateString(),
                priority: "medium", // Default priority
                timestamp: Date.now(), // For sorting
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

    const updateTaskPriority = (taskId, priority) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, priority } : task
            )
        );
    };

    // Sort and Filter Functions
    const getPriorityOrder = (priority) => {
        const order = { high: 3, medium: 2, low: 1 };
        return order[priority] || 0;
    };

    const sortTasks = (tasksToSort) => {
        return [...tasksToSort].sort((a, b) => {
            const multiplier = sortDirection === "desc" ? -1 : 1;

            switch (sortCriteria) {
                case "priority":
                    return (getPriorityOrder(b.priority) - getPriorityOrder(a.priority)) * multiplier;
                case "alphabetical":
                    return a.text.localeCompare(b.text) * multiplier;
                case "completion":
                    return (a.completed === b.completed ? 0 : a.completed ? 1 : -1) * multiplier;
                default: // date
                    return (b.timestamp - a.timestamp) * multiplier;
            }
        });
    };

    // Filter tasks based on search, active tab, and sort
    const filteredAndSortedTasks = sortTasks(
        tasks.filter((task) => {
            const matchesSearch = task.text
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            return matchesSearch;
        })
    );


    // Priority color mapping
    const getPriorityColor = (priority) => {
        const colors = {
            high: "text-red-400",
            medium: "text-yellow-400",
            low: "text-blue-400",
        };
        return colors[priority] || "text-gray-400";
    };

    return (
        <div className="min-h-screen bg-transparent text-white">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* ... Your existing stats cards ... */}
                </motion.div>

                {/* Task Management Section */}
                <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-6">
                    {/* Search and Sort Controls */}
                    <div className="mb-6 space-y-4">
                        <div className="flex gap-3 flex-col md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/20 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border border-white/10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={sortCriteria}
                                    onChange={(e) => setSortCriteria(e.target.value)}
                                    className="bg-black/20 text-white px-4 py-3 rounded-lg outline-none border border-white/10"
                                >
                                    <option value="date">Date</option>
                                    <option value="priority">Priority</option>
                                    <option value="alphabetical">Alphabetical</option>
                                    <option value="completion">Completion</option>
                                </select>
                                <button
                                    onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                                    className="px-4 bg-black/20 rounded-lg border border-white/10"
                                    title="Revert"
                                >
                                    {sortDirection === "asc" ? "A - Z" : "Z - A"}
                                </button>
                            </div>
                        </div>

                        {/* Add Task Input */}
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
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-[calc(100vh-450px)]">
                        <AnimatePresence>
                            {filteredAndSortedTasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="group transform transition-all duration-300"
                                >
                                    <div
                                        className={`backdrop-blur-xl rounded-lg border-t-4 shadow-lg ${task.completed ? "bg-green-500/10 border-green-500/50" : "bg-white/10 border-purple-500/50"}`}>
                                        <div className="p-4">
                                            <div className="flex items-start gap-4 mb-3">
                                                <button
                                                    onClick={() => toggleTaskCompletion(task.id)}
                                                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed
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
                                                            <div className="flex items-center gap-2">
                                                                <p
                                                                    className={`text-sm ${task.completed
                                                                        ? "line-through text-gray-400"
                                                                        : "text-white"
                                                                        }`}
                                                                >
                                                                    {task.text}
                                                                </p>
                                                                <Flag
                                                                    size={14}
                                                                    className={getPriorityColor(task.priority)}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                                                <Calendar size={12} />
                                                                <span>{task.createdAt}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center gap-2 pt-2 border-t border-white/10">
                                                <select
                                                    value={task.priority}
                                                    onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                                                    className="bg-black/20 text-white text-sm px-2 py-1 rounded outline-none border border-white/10"
                                                >
                                                    <option value="high">High</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="low">Low</option>
                                                </select>

                                                <div className="flex gap-2">
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
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
                    {filteredAndSortedTasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <p className="text-white">No tasks found</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Task;