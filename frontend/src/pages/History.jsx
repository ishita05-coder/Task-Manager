import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getHistory, resetHistoryState } from '../redux/slices/historySlice';
import { LogOut, Calendar, Clock, ArrowLeft, Menu, X, UserX } from 'lucide-react';
import { logout, reset as resetAuth, deleteAccount } from '../redux/slices/authSlice';

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

  const handleDeleteAccount = () => {
    if (window.confirm("WARNING: Are you sure you want to permanently delete your account? All your tasks and history will be lost. This cannot be undone.")) {
      dispatch(deleteAccount());
      dispatch(resetAuth());
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden vibrant-bg-alt">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-card glass-card-dark transform transition-transform duration-300 ease-out md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="w-8 md:hidden"></div> {/* Spacer for centering */}
            <h1 className="text-2xl font-extrabold text-gradient">TaskFlow</h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 px-4 py-6 space-y-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50 flex items-center gap-3 transition-colors">
              <Calendar className="w-5 h-5" /> All Tasks
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-full px-4 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-brand shadow-md flex items-center gap-3 hover:-translate-y-0.5 transition-all">
              <Clock className="w-5 h-5" /> Activity History
            </button>
          </div>
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left font-medium"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors w-full text-left font-medium"
            >
              <UserX className="w-5 h-5" /> Delete Account
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
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-700 rounded-xl hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-800/50 transition-colors md:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="p-2 bg-white/70 backdrop-blur-md rounded-xl shadow-sm dark:bg-gray-800/70 text-gray-600 dark:text-gray-300 hover:shadow-md transition-all">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight animate-fade-in-up">Activity History</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>A timeline of all your task modifications.</p>
            </div>
          </div>

        <div className="glass-card glass-card-dark rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {isLoading ? (
            <p className="text-gray-500">Loading history...</p>
          ) : history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gradient-brand rounded-full mt-1.5 shadow-md"></div>
                    <div className="w-0.5 h-full bg-gray-200/50 dark:bg-gray-700/50 mt-2"></div>
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
