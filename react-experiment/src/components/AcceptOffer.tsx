import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOffersByRequestId,
  getUserById,
  saveOffer,
  markNotificationAsReadByOfferId,
} from '../services/storage';
import type { Request, Offer } from '../types';

type AcceptOfferProps = {
  request: Request;
  onClose: () => void;
  onUpdate: () => void;
};

export const AcceptOffer = ({ request, onClose, onUpdate }: AcceptOfferProps) => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const requestOffers = getOffersByRequestId(request.id);
    setOffers(requestOffers);
  }, [request.id]);

  const handleAccept = (offer: Offer) => {
    if (!user || user.id !== request.creatorId) return;

    const updatedOffer = { ...offer, accepted: true };
    saveOffer(updatedOffer);
    markNotificationAsReadByOfferId(offer.id);
    onUpdate();
    onClose();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Offers for: {request.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          {offers.length === 0 ? (
            <p className="text-gray-500">No offers yet.</p>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => {
                const offerer = getUserById(offer.offererId);
                if (!offerer) return null;

                return (
                  <div
                    key={offer.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{offerer.name}</h3>
                        <p className="text-sm text-gray-600">{offerer.year} - {offerer.major}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Offered on {formatDate(offer.createdAt)}
                        </p>
                      </div>
                    </div>
                    {offer.accepted ? (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-sm font-medium text-green-800">Accepted</p>
                        <p className="text-sm text-green-700 mt-1">
                          Contact: <strong>{offerer.email}</strong>
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAccept(offer)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

