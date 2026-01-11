import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, getOffersByRequestId, saveOffer, saveNotification } from '../services/storage';
import type { Request, Offer } from '../types';
import { AcceptOffer } from './AcceptOffer';

type RequestItemProps = {
  request: Request;
  onUpdate: () => void;
};

export const RequestItem = ({ request, onUpdate }: RequestItemProps) => {
  const { user } = useAuth();
  const [showAcceptOffer, setShowAcceptOffer] = useState(false);
  const [offers, setOffers] = useState<Offer[]>(getOffersByRequestId(request.id));
  const creator = getUserById(request.creatorId);
  const userOffer = user ? offers.find((o) => o.offererId === user.id) : null;
  const isCreator = user?.id === request.creatorId;

  useEffect(() => {
    setOffers(getOffersByRequestId(request.id));
  }, [request.id]);

  const handleOfferHelp = () => {
    if (!user) return;

    const offerId = crypto.randomUUID();
    const offer = {
      id: offerId,
      requestId: request.id,
      offererId: user.id,
      createdAt: Date.now(),
      accepted: false,
    };

    saveOffer(offer);

    const notification = {
      id: crypto.randomUUID(),
      userId: request.creatorId,
      requestId: request.id,
      offerId: offerId,
      read: false,
      createdAt: Date.now(),
    };

    saveNotification(notification);
    
    // Update local offers state immediately
    setOffers([...offers, offer]);
    onUpdate();
  };

  const handleViewOffers = () => {
    setShowAcceptOffer(true);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
          <span className="text-sm text-gray-500">{formatDate(request.createdAt)}</span>
        </div>
        <p className="text-gray-700 mb-3">{request.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {creator ? `by ${creator.name}` : 'Unknown user'}
          </span>
          <div className="flex gap-2">
            {isCreator && offers.length > 0 && (
              <button
                onClick={handleViewOffers}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                View Offers ({offers.length})
              </button>
            )}
            {!isCreator && !userOffer && (
              <button
                onClick={handleOfferHelp}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Offer Help
              </button>
            )}
            {!isCreator && userOffer && (
              <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm">
                You offered help
              </span>
            )}
          </div>
        </div>
      </div>
      {showAcceptOffer && (
        <AcceptOffer
          request={request}
          onClose={() => setShowAcceptOffer(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

