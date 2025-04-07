import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import VisitorStats from '@/components/dashboard/VisitorStats';
import PaymentStats from '@/components/dashboard/PaymentStats';
import VisitorsChart from '@/components/dashboard/VisitorsChart';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import { fetchDashboardStats, DashboardStats, formatCurrency } from '@/utils/dashboardDataUtils';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const dashboardStats = await fetchDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do dashboard.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [toast]);

  const testProductId = stats?.recentOrders[0]?.product_id || "1";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <PaymentStats
          pixGenerated={stats?.pixOrders || 0}
          pixCompleted={stats?.pixCompleted || 0}
          cardCaptured={stats?.cardOrders || 0}
          totalValue={stats?.totalRevenue || 0}
          loading={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Produtos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? '...' : stats?.totalOrders || 0}
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/products">
                <Button variant="outline">Ver produtos</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Total de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? '...' : stats?.totalOrders || 0}
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/orders">
                <Button variant="outline">Ver pedidos</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VisitorsChart visitorsData={stats?.visitorsData || []} loading={loading} />
          <PaymentMethodsChart data={stats?.paymentMethodsDistribution || []} loading={loading} />
        </div>

        {/* Test Buttons + PIX Config Link */}
        <div className="flex flex-wrap gap-4">
          <Link to="/checkout/test-product">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Testar Checkout
            </Button>
          </Link>

          <Link to={`/quick-checkout/${testProductId}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Testar Checkout Rápido
            </Button>
          </Link>

          <Link to="/admin/pix-settings">
            <Button variant="outline">
              Editar PIX Manual
            </Button>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando pedidos recentes...</p>
            ) : stats?.recentOrders.length === 0 ? (
              <p className="text-gray-500">Nenhum pedido recente encontrado</p>
            ) : (
              <div className="space-y-4">
                {stats?.recentOrders.map((order) => (
                  <div key={order.id} className="border-b pb-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">{order.product_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(Number(order.price))}</p>
                        <p className={
                          order.status === 'Pago'
                            ? 'text-sm text-green-600'
                            : order.status === 'Recusado'
                              ? 'text-sm text-red-600'
                              : 'text-sm text-amber-600'
                        }>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/admin/orders">
              <Button variant="outline">Ver todos os pedidos</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
