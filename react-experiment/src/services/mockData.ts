import type { User, Request, Offer, Notification } from '../types';
import {
  saveUser,
  saveRequest,
  saveOffer,
  saveNotification,
  getAllUsers,
  getAllRequests,
} from './storage';

const MOCK_USERS: Omit<User, 'id'>[] = [
  {
    email: 'alice.smith@northwestern.edu',
    name: 'Alice Smith',
    year: 'Sophomore',
    major: 'Computer Science',
  },
  {
    email: 'beatrice.jones@northwestern.edu',
    name: 'Beatrice Jones',
    year: 'Junior',
    major: 'Economics',
  },
  {
    email: 'charlie.brown@northwestern.edu',
    name: 'Charlie Brown',
    year: 'Senior',
    major: 'Engineering',
  },
  {
    email: 'diana.wilson@northwestern.edu',
    name: 'Diana Wilson',
    year: 'First Year',
    major: 'Psychology',
  },
];

export const seedMockData = () => {
  // Clear existing data (optional - you might want to skip this)
  // For testing, we'll just add mock data alongside existing data

  const users: User[] = [];
  
  // Create mock users
  MOCK_USERS.forEach((userData, index) => {
    const existingUser = getAllUsers().find((u) => u.email === userData.email);
    if (!existingUser) {
      const user: User = {
        id: `mock-user-${index + 1}`,
        ...userData,
      };
      saveUser(user);
      users.push(user);
    } else {
      users.push(existingUser);
    }
  });

  // Create mock requests if they don't exist
  const existingRequests = getAllRequests();
  const mockRequestIds: string[] = [];

  if (!existingRequests.find((r) => r.title === 'Need a ride to HMart')) {
    const request1: Request = {
      id: 'mock-request-1',
      title: 'Need a ride to HMart',
      description: 'Just got back from winter break and need to restock my mini-fridge! Looking for someone with a car who can give me a ride to HMart this weekend.',
      creatorId: users[0].id, // Alice
      createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    };
    saveRequest(request1);
    mockRequestIds.push(request1.id);
  }

  if (!existingRequests.find((r) => r.title === 'Study group for CS 211')) {
    const request2: Request = {
      id: 'mock-request-2',
      title: 'Study group for CS 211',
      description: 'Looking for a few people to form a study group for the upcoming midterm. Prefer meeting at the library or Tech.',
      creatorId: users[1].id, // Beatrice
      createdAt: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    };
    saveRequest(request2);
    mockRequestIds.push(request2.id);
  }

  if (!existingRequests.find((r) => r.title === 'Borrow a calculator for exam')) {
    const request3: Request = {
      id: 'mock-request-3',
      title: 'Borrow a calculator for exam',
      description: 'Forgot my calculator at home! Need to borrow a TI-84 or similar for my math exam tomorrow morning.',
      creatorId: users[3].id, // Diana
      createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    };
    saveRequest(request3);
    mockRequestIds.push(request3.id);

    // Add an offer for this request
    const offer1: Offer = {
      id: 'mock-offer-1',
      requestId: request3.id,
      offererId: users[2].id, // Charlie offers help to Diana
      createdAt: Date.now() - 20 * 60 * 60 * 1000,
      accepted: false,
    };
    saveOffer(offer1);

    const notification1: Notification = {
      id: 'mock-notification-1',
      userId: request3.creatorId,
      requestId: request3.id,
      offerId: offer1.id,
      read: false,
      createdAt: offer1.createdAt,
    };
    saveNotification(notification1);
  }

  if (!existingRequests.find((r) => r.title === 'Looking for roommate next year')) {
    const request4: Request = {
      id: 'mock-request-4',
      title: 'Looking for roommate next year',
      description: 'Rising junior looking for a roommate for off-campus housing next year. Prefer someone quiet and clean. Message me if interested!',
      creatorId: users[2].id, // Charlie
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    };
    saveRequest(request4);
    mockRequestIds.push(request4.id);
  }

  return {
    users,
    message: 'Mock data seeded successfully!',
  };
};

export const clearMockData = () => {
  localStorage.removeItem('wildcat_mutual_aid_users');
  localStorage.removeItem('wildcat_mutual_aid_requests');
  localStorage.removeItem('wildcat_mutual_aid_offers');
  localStorage.removeItem('wildcat_mutual_aid_notifications');
  localStorage.removeItem('wildcat_mutual_aid_current_user');
};

