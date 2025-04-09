import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/product';
import { OrderProvider } from './contexts/order';
import { AsaasProvider } from './contexts/AsaasContext';
import { PixelProvider } from './contexts/PixelContext';
import { CheckoutCustomizationProvider } from './contexts/CheckoutCustomizationContext';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/admin/Products';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import PaymentSettings from './pages/admin/PaymentSettings';
import PixelSettings from './pages/admin/PixelSettings';
import CheckoutCustomization from './pages/admin/CheckoutCustomization';
import Checkout from './pages/Checkout';
import QuickCheckout from './pages/QuickCheckout';
import PaymentFailed from './pages/PaymentFailed';
import PaymentSuccess from './pages/PaymentSuccess';
import PixPaymentManual from './pages/PixPaymentManual';
import PaymentPending from './pages/PaymentPending';
import PixSettings from './pages/admin/PixSettings';
import PixPaymentAsaas from '@/pages/PixPaymentAsaas';


// Components
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <AsaasProvider>
              <PixelProvider>
                <CheckoutCustomizationProvider>
                  <Routes>
                    {/* Redirecionar página raiz para login admin */}
                    <Route path="/" element={<Navigate to="/admin/login" replace />} />

                    {/* Páginas gerais */}
                    <Route path="/index" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />

                    {/* Rotas administrativas */}
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<Products />} />
                    <Route path="/admin/orders" element={<Orders />} />
                    <Route path="/admin/settings/payment" element={<PaymentSettings />} />
                    <Route path="/admin/pixel-settings" element={<PixelSettings />} />
                    <Route path="/admin/checkout-customization" element={<CheckoutCustomization />} />
                    <Route path="/admin/pix-settings" element={<PixSettings />} />

                    {/* Redirecionamentos antigos para rotas atualizadas */}
                    <Route path="/admin/asaas-settings" element={<Navigate to="/admin/settings/payment" replace />} />
                    <Route path="/admin/payments" element={<Navigate to="/admin/settings/payment" replace />} />
                    <Route path="/payments" element={<Navigate to="/admin/settings/payment" replace />} />

                    {/* Rotas de checkout */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/:productSlug" element={<Checkout />} />
                    <Route path="/quick-checkout/:productId" element={<QuickCheckout />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-pending" element={<PaymentPending />} />
                    <Route path="/pix-asaas/:productSlug" element={<PixPaymentAsaas />} />


                    {/* Rota de pagamento PIX manual com slug */}
                    <Route path="/pix-payment/:productSlug" element={<PixPaymentManual />} />

                    {/* Redirecionar rota incorreta (sem slug) para o checkout */}
                    <Route path="/pix-payment-manual" element={<Navigate to="/checkout" replace />} />

                    {/* Página 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </CheckoutCustomizationProvider>
              </PixelProvider>
            </AsaasProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
