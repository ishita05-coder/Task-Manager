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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-md p-8 bg-white shadow-[0_0_60px_-15px_rgba(236,72,153,0.5)] rounded-3xl animate-fade-in-up border-2 border-white/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gradient">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-medium text-gray-900 bg-pink-50/30"
              placeholder="E.g., Complete project presentation"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-medium text-gray-900 bg-pink-50/30 resize-none"
              placeholder="Add more details about this task..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={status}
                onChange={onChange}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-medium text-gray-900 bg-pink-50/30"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={priority}
                onChange={onChange}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-medium text-gray-900 bg-pink-50/30"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={dueDate}
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-medium text-gray-900 bg-pink-50/30"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-vibrant"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
