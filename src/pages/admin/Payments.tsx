
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import PaymentForm from '@/components/payments/PaymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode, ExternalLink, Settings, ShoppingCart } from 'lucide-react';
import { useAsaas } from '@/contexts/AsaasContext';

const Payments = () => {
  const { settings, loading } = useAsaas();

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Processar Pagamento</h1>
          <p className="text-muted-foreground">Criar uma nova transação de pagamento</p>
        </div>
        
        <div className="flex space-x-2">
          <Link to="/admin/orders">
            <Button variant="outline" className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver Pedidos
            </Button>
          </Link>
          <Link to="/admin/settings/payment">
            <Button variant="outline" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Configurações de Pagamento
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6 space-y-2">
        <Link to="/checkout/assinatura-mensal-cineflick-card">
          <Button className="flex items-center">
            <ExternalLink className="mr-2 h-4 w-4" />
            Acessar Página de Checkout (CineFlick)
          </Button>
        </Link>
        <Link to="/checkout/product-demo">
          <Button variant="outline" className="flex items-center">
            <ExternalLink className="mr-2 h-4 w-4" />
            Acessar Página de Checkout (Demo)
          </Button>
        </Link>
      </div>
      
      {!loading && settings.isEnabled ? (
        <Tabs defaultValue="card">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            {settings.allowCreditCard && (
              <TabsTrigger value="card" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Cartão de Crédito</span>
              </TabsTrigger>
            )}
            {settings.allowPix && (
              <TabsTrigger value="pix" className="flex items-center">
                <QrCode className="mr-2 h-4 w-4" />
                <span>PIX</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          {settings.allowCreditCard && (
            <TabsContent value="card">
              <PaymentForm />
            </TabsContent>
          )}
          
          {settings.allowPix && (
            <TabsContent value="pix">
              <Card>
                <CardHeader>
                  <CardTitle>Pagamento PIX</CardTitle>
                  <CardDescription>
                    Gere um QR code PIX para pagamento instantâneo
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center mb-4">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-center text-sm text-gray-500 mb-4">
                    Escaneie este QR code com seu aplicativo bancário para realizar um pagamento instantâneo
                  </p>
                  <Button variant="outline" className="mb-2">
                    Copiar Chave PIX
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Gerar Novo Código
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Processamento de Pagamento</CardTitle>
            <CardDescription>
              O processamento de pagamento está atualmente desativado. Ative-o nas configurações.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/admin/settings/payment">
              <Button className="flex items-center bg-green-600 hover:bg-green-700">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Pagamento
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
};

export default Payments;
