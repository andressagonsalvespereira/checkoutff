
import React from 'react';
import { Order } from '@/types/order';

interface CardDetailsSectionProps {
  cardDetails: NonNullable<Order['cardDetails']>;
}

const CardDetailsSection: React.FC<CardDetailsSectionProps> = ({ cardDetails }) => {
  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-medium mb-2">Dados do Cartão</h4>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Número:</dt>
          <dd>{cardDetails.number}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Validade:</dt>
          <dd>{cardDetails.expiryMonth}/{cardDetails.expiryYear}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">CVV:</dt>
          <dd>{cardDetails.cvv}</dd>
        </div>
        {cardDetails.brand && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Bandeira:</dt>
            <dd>{cardDetails.brand}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default CardDetailsSection;
