
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  customer: string;
  amount: string;
  method: string;
  status: 'completed' | 'failed' | 'pending';
  date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const StatusIcon = ({ status }: { status: Transaction['status'] }) => {
  switch (status) {
    case 'completed':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <X className="h-5 w-5 text-red-500" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
};

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          View all
        </a>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{transaction.customer}</td>
                  <td className="py-3 px-4 font-medium">{transaction.amount}</td>
                  <td className="py-3 px-4">{transaction.method}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <StatusIcon status={transaction.status} />
                      <span className="ml-2 capitalize">{transaction.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
