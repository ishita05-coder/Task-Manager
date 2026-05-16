import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getHistory, resetHistoryState } from '../redux/slices/historySlice';
import { LogOut, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { logout, reset as resetAuth } from '../redux/slices/authSlice';

export default function History() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { history, isLoading } = useSelector((state) => state.history);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getHistory());
    }
    return () => {
      dispatch(resetHistoryState());
    };
  }, [user, navigate, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetAuth());
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 hidden md:block">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">TaskFlow</h1>
          </div>
          <div className="flex-1 px-4 py-6 space-y-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 flex items-center gap-3">
              <Calendar className="w-5 h-5" /> All Tasks
            </Link>
            <div className="px-3 py-2 text-sm font-medium text-gray-900 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white flex items-center gap-3">
              <Clock className="w-5 h-5" /> Activity History
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 bg-white rounded-lg shadow-sm dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h2>
            <p className="text-gray-600 dark:text-gray-400">A timeline of all your task modifications.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
          {isLoading ? (
            <p className="text-gray-500">Loading history...</p>
          ) : history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mt-1.5"></div>
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No activity found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
