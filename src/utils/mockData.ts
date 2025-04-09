
export const transactions = [
  {
    id: '1',
    customer: 'Carlos Silva',
    amount: 'R$120.00',
    method: 'Credit Card',
    status: 'completed' as const,
    date: '2023-06-01',
  },
  {
    id: '2',
    customer: 'Maria Oliveira',
    amount: 'R$75.50',
    method: 'Credit Card',
    status: 'completed' as const,
    date: '2023-06-02',
  },
  {
    id: '3',
    customer: 'João Santos',
    amount: 'R$200.00',
    method: 'PIX',
    status: 'pending' as const,
    date: '2023-06-03',
  },
  {
    id: '4',
    customer: 'Ana Souza',
    amount: 'R$45.99',
    method: 'Credit Card',
    status: 'failed' as const,
    date: '2023-06-04',
  },
  {
    id: '5',
    customer: 'Pedro Costa',
    amount: 'R$150.00',
    method: 'PIX',
    status: 'completed' as const,
    date: '2023-06-05',
  },
];

export const customers = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@example.com',
    totalSpent: 'R$750.00',
    lastPurchase: '2023-06-01',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    totalSpent: 'R$1,250.00',
    lastPurchase: '2023-06-02',
  },
  {
    id: '3',
    name: 'João Santos',
    email: 'joao.santos@example.com',
    totalSpent: 'R$2,100.00',
    lastPurchase: '2023-06-03',
  },
  {
    id: '4',
    name: 'Ana Souza',
    email: 'ana.souza@example.com',
    totalSpent: 'R$450.00',
    lastPurchase: '2023-06-04',
  },
  {
    id: '5',
    name: 'Pedro Costa',
    email: 'pedro.costa@example.com',
    totalSpent: 'R$895.00',
    lastPurchase: '2023-06-05',
  },
];
