export type User = {
  id: string;
  email: string;
  name: string;
  year: string;
  major: string;
};

export type Request = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  createdAt: number;
};

export type Offer = {
  id: string;
  requestId: string;
  offererId: string;
  createdAt: number;
  accepted: boolean;
};

export type Notification = {
  id: string;
  userId: string;
  requestId: string;
  offerId: string;
  read: boolean;
  createdAt: number;
};

