import type { User, Request, Offer, Notification } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'wildcat_mutual_aid_current_user',
  USERS: 'wildcat_mutual_aid_users',
  REQUESTS: 'wildcat_mutual_aid_requests',
  OFFERS: 'wildcat_mutual_aid_offers',
  NOTIFICATIONS: 'wildcat_mutual_aid_notifications',
} as const;

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getAllUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : [];
};

export const getUserById = (id: string): User | null => {
  const users = getAllUsers();
  return users.find((u) => u.id === id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return users.find((u) => u.email === email) || null;
};

export const saveUser = (user: User): void => {
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getAllRequests = (): Request[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  return stored ? JSON.parse(stored) : [];
};

export const getRequestById = (id: string): Request | null => {
  const requests = getAllRequests();
  return requests.find((r) => r.id === id) || null;
};

export const saveRequest = (request: Request): void => {
  const requests = getAllRequests();
  const existingIndex = requests.findIndex((r) => r.id === request.id);
  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.push(request);
  }
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

export const getAllOffers = (): Offer[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.OFFERS);
  return stored ? JSON.parse(stored) : [];
};

export const getOffersByRequestId = (requestId: string): Offer[] => {
  const offers = getAllOffers();
  return offers.filter((o) => o.requestId === requestId);
};

export const getOffersByOffererId = (offererId: string): Offer[] => {
  const offers = getAllOffers();
  return offers.filter((o) => o.offererId === offererId);
};

export const getOfferById = (id: string): Offer | null => {
  const offers = getAllOffers();
  return offers.find((o) => o.id === id) || null;
};

export const saveOffer = (offer: Offer): void => {
  const offers = getAllOffers();
  const existingIndex = offers.findIndex((o) => o.id === offer.id);
  if (existingIndex >= 0) {
    offers[existingIndex] = offer;
  } else {
    offers.push(offer);
  }
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
};

export const getAllNotifications = (): Notification[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return stored ? JSON.parse(stored) : [];
};

export const getNotificationsByUserId = (userId: string): Notification[] => {
  const notifications = getAllNotifications();
  return notifications.filter((n) => n.userId === userId);
};

export const getUnreadNotificationsCount = (userId: string): number => {
  const notifications = getNotificationsByUserId(userId);
  return notifications.filter((n) => !n.read).length;
};

export const saveNotification = (notification: Notification): void => {
  const notifications = getAllNotifications();
  const existingIndex = notifications.findIndex((n) => n.id === notification.id);
  if (existingIndex >= 0) {
    notifications[existingIndex] = notification;
  } else {
    notifications.push(notification);
  }
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getAllNotifications();
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const markNotificationAsReadByOfferId = (offerId: string): void => {
  const notifications = getAllNotifications();
  const notification = notifications.find((n) => n.offerId === offerId);
  if (notification) {
    notification.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const markAllNotificationsAsRead = (userId: string): void => {
  const notifications = getAllNotifications();
  notifications.forEach((n) => {
    if (n.userId === userId && !n.read) {
      n.read = true;
    }
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

