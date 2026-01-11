import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserByEmail, saveUser, getAllUsers } from '../services/storage';
import { seedMockData } from '../services/mockData';
import type { User } from '../types';

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');
  const [mockDataMessage, setMockDataMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !name || !year || !major) {
      setError('All fields are required');
      return;
    }

    if (!email.endsWith('@northwestern.edu')) {
      setError('Email must be a Northwestern email (@northwestern.edu)');
      return;
    }

    const existingUser = getUserByEmail(email);
    let userId = existingUser?.id || crypto.randomUUID();

    const userData: User = {
      id: userId,
      email,
      name,
      year,
      major,
    };

    saveUser(userData);
    setUser(userData);
  };

  if (user) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Year:</strong> {user.year}</p>
            <p><strong>Major:</strong> {user.major}</p>
          </div>
          <button
            onClick={() => setUser(null)}
            className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleSeedMockData = () => {
    seedMockData();
    setMockDataMessage('Mock data loaded! You can now sign in as any user (e.g., alice.smith@northwestern.edu)');
    setTimeout(() => setMockDataMessage(''), 5000);
  };

  const handleQuickSignIn = (userEmail: string) => {
    const mockUser = getUserByEmail(userEmail);
    if (mockUser) {
      setUser(mockUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Wildcat Mutual Aid</h1>
        <p className="text-center text-gray-600 mb-6">Sign in to continue</p>
        
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 mb-2 font-semibold">Testing Mode:</p>
          <button
            type="button"
            onClick={handleSeedMockData}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm mb-2"
          >
            Load Mock Data
          </button>
          {mockDataMessage && (
            <p className="text-xs text-blue-700 mt-2">{mockDataMessage}</p>
          )}
          {getAllUsers().length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700 mb-2 font-semibold">Quick Sign In:</p>
              <div className="flex flex-col gap-1">
                {getAllUsers().slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSignIn(u.email)}
                    className="text-xs bg-white border border-blue-300 text-blue-700 py-1 px-2 rounded hover:bg-blue-50"
                  >
                    {u.name} ({u.email})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Northwestern Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.name@northwestern.edu"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select year</option>
              <option value="First Year">First Year</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
              Major
            </label>
            <input
              type="text"
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In / Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

