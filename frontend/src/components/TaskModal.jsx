import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../redux/slices/taskSlice';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaskModal({ isOpen, onClose, task }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });

  const { title, description, priority, status, dueDate } = formData;

  // Sync state when editing a task
  useState(() => {
     if (task) {
        setFormData({
           title: task.title,
           description: task.description || '',
           priority: task.priority,
           status: task.status,
           dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
     }
  }, [task]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error('Please enter a title');
      return;
    }
    
    if (task) {
      await dispatch(updateTask({ ...formData, _id: task._id }));
      toast.success('Task updated successfully');
    } else {
      await dispatch(createTask(formData));
      toast.success('Task created successfully');
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 glass-card glass-card-dark rounded-2xl animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={status}
                onChange={onChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <select
                name="priority"
                value={priority}
                onChange={onChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={dueDate}
              onChange={onChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
