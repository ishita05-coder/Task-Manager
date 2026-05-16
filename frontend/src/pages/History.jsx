import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getHistory, resetHistoryState } from '../redux/slices/historySlice';
import { LogOut, Calendar, Clock, ArrowLeft, Menu, X } from 'lucide-react';
import { logout, reset as resetAuth } from '../redux/slices/authSlice';

export default function History() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 flex items-center gap-3">
              <Calendar className="w-5 h-5" /> All Tasks
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-full px-3 py-2 text-sm font-medium text-gray-900 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white flex items-center gap-3">
              <Clock className="w-5 h-5" /> Activity History
            </button>
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

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="p-2 bg-white rounded-lg shadow-sm dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
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
        </div>
      </main>
    </div>
  );
}
