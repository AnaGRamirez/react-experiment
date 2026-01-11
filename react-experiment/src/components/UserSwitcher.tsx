import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, getUserByEmail } from '../services/storage';

export const UserSwitcher = () => {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const allUsers = getAllUsers();

  if (allUsers.length === 0) return null;

  const handleSwitchUser = (email: string) => {
    const targetUser = getUserByEmail(email);
    if (targetUser) {
      setUser(targetUser);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
      >
        Switch User
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-sm">Switch User (Testing)</h3>
              <p className="text-xs text-gray-500 mt-1">Current: {user?.name}</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {allUsers.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500">No users</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSwitchUser(u.email)}
                      className={`w-full text-left p-3 hover:bg-gray-50 text-sm ${
                        user?.id === u.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                      <div className="text-xs text-gray-400 mt-1">{u.year} - {u.major}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

