
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/order';

interface CustomerInfoCardProps {
  customer: Order['customer'];
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customer }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dados do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nome:</dt>
            <dd>{customer.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">E-mail:</dt>
            <dd>{customer.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">CPF:</dt>
            <dd>{customer.cpf}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Telefone:</dt>
            <dd>{customer.phone}</dd>
          </div>
          {customer.address && (
            <>
              <div className="pt-2">
                <dt className="text-sm font-medium text-gray-500">Endereço:</dt>
                <dd>
                  {customer.address.street}, {customer.address.number}
                  {customer.address.complement && `, ${customer.address.complement}`}
                </dd>
                <dd>
                  {customer.address.neighborhood}, {customer.address.city} - {customer.address.state}
                </dd>
                <dd>CEP: {customer.address.postalCode}</dd>
              </div>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;
