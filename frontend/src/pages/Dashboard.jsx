import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout, reset as resetAuth } from '../redux/slices/authSlice';
import { getTasks, resetTaskState, taskAdded, taskUpdated, taskDeleted, deleteTask } from '../redux/slices/taskSlice';
import { LogOut, Plus, Search, Calendar, AlertCircle, CheckCircle2, Clock, Trash2, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import TaskModal from '../components/TaskModal';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this task?')) {
       dispatch(deleteTask(id));
    }
  };

  const { user } = useSelector((state) => state.auth);
  const { tasks, isLoading, isError, message, total } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getTasks(''));
    }

    return () => {
      dispatch(resetTaskState());
    };
  }, [user, navigate, isError, message, dispatch]);

  useEffect(() => {
    const socket = io(import.meta.env.PROD ? 'https://task-manager-backend-61um.onrender.com' : 'http://localhost:5000');
    
    socket.on('taskAdded', (task) => {
       dispatch(taskAdded(task));
       toast.success('New task added!');
    });

    socket.on('taskUpdated', (task) => {
       dispatch(taskUpdated(task));
    });

    socket.on('taskDeleted', (taskId) => {
       dispatch(taskDeleted(taskId));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetAuth());
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 md:hidden"></div> {/* Spacer for centering */}
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">TaskFlow</h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 px-4 py-6 space-y-4">
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-full px-3 py-2 text-sm font-medium text-gray-900 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white flex items-center gap-3">
              <Calendar className="w-5 h-5" /> All Tasks
            </button>
            <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 flex items-center gap-3">
              <Clock className="w-5 h-5" /> Activity History
            </Link>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 md:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">TaskFlow</h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h2>
              <p className="text-gray-600 dark:text-gray-400">Here's an overview of your tasks.</p>
            </div>
            <button 
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm transition-colors w-fit"
            >
              <Plus className="w-5 h-5" /> New Task
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{total}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>
             <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {tasks.filter(t => t.status === 'Completed').length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>
             <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                     {tasks.filter(t => t.status === 'In Progress').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>
             <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h3>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Task Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Assigned To</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr 
                        key={task._id} 
                        onClick={() => handleEditTask(task)}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           {task.assignedTo?.name || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4">
                           {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={(e) => handleDeleteTask(e, task._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-5 h-5 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="px-6 py-4 text-center">No tasks found. Create one!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} task={taskToEdit} />
    </div>
  );
}

export default Dashboard;
