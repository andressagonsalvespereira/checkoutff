
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Home, Settings, Package, CreditCard, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Sistema de Pagamentos</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Plataforma completa para gerenciar produtos, pagamentos e configurações de checkout.
        </p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Admin Dashboard */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Painel Administrativo</CardTitle>
              <CardDescription>
                Acesse o painel completo com todas as funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Gerenciamento centralizado de produtos, pedidos e configurações.
              </p>
            </CardContent>
            <CardFooter>
              <Link to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {isAuthenticated ? "Acessar Dashboard" : "Fazer Login"}
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Products */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>
                Gerencie seu catálogo de produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Cadastre, edite e remova produtos disponíveis para venda.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/products" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Gerenciar Produtos
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Orders */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Pedidos</CardTitle>
              <CardDescription>
                Acompanhe os pedidos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Visualize todos os pedidos e seus status de pagamento.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/orders" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ver Pedidos
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Configurations */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Settings className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Configure a integração com a API Asaas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Defina chaves de API, modo sandbox e métodos de pagamento.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/settings/payment" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Configurar Pagamentos
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Pixels */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                <Tag className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Pixels</CardTitle>
              <CardDescription>
                Configure pixels de rastreamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Integre pixels do Google Analytics e Meta para rastreamento.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/pixel-settings" className="w-full">
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  Configurar Pixels
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Checkout */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-2">
                <CreditCard className="w-6 h-6 text-cyan-600" />
              </div>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>
                Teste o fluxo de checkout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Visualize e teste a experiência de checkout completa.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/checkout/test-product" className="w-full">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Testar Checkout
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
