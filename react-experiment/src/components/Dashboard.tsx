import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllRequests } from '../services/storage';
import { RequestForm } from './RequestForm';
import { RequestItem } from './RequestItem';
import { Notifications } from './Notifications';
import { UserSwitcher } from './UserSwitcher';
import type { Request } from '../types';

export const Dashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const loadRequests = () => {
    const allRequests = getAllRequests();
    setRequests(allRequests.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Wildcat Mutual Aid</h1>
          <div className="flex items-center gap-4">
            <UserSwitcher />
            <Notifications />
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Request
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No requests yet.</p>
              <p className="text-gray-400 mt-2">Be the first to create one!</p>
            </div>
          ) : (
            requests.map((request) => (
              <RequestItem
                key={request.id}
                request={request}
                onUpdate={loadRequests}
              />
            ))
          )}
        </div>
      </div>
      {showRequestForm && (
        <RequestForm
          onClose={() => setShowRequestForm(false)}
          onRequestCreated={loadRequests}
        />
      )}
    </div>
  );
};

