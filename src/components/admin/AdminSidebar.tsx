
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Package, 
  CreditCard, 
  QrCode, 
  LogOut, 
  ShoppingCart,
  Tag,
  BarChart,
  Users,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-md",
        isActive 
          ? "bg-blue-700 text-white" 
          : "text-blue-100 hover:bg-blue-700 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Get a product id for quick checkout testing
  const testProductId = "1"; // Default test product ID

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-blue-800 text-white">
      <div className="p-4 border-b border-blue-700">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          <h1 className="text-xl font-bold">Painel Admin</h1>
        </Link>
      </div>
      
      <div className="flex-1 py-4 px-2 space-y-1">
        <SidebarItem 
          icon={BarChart} 
          label="Dashboard" 
          href="/admin/dashboard" 
          isActive={isActive('/admin/dashboard')}
        />
        <SidebarItem 
          icon={Settings} 
          label="Configurações de Pagamento" 
          href="/admin/settings/payment" 
          isActive={isActive('/admin/settings/payment')}
        />
        <SidebarItem 
          icon={Package} 
          label="Produtos" 
          href="/admin/products" 
          isActive={isActive('/admin/products')}
        />
        <SidebarItem 
          icon={ShoppingCart} 
          label="Pedidos" 
          href="/admin/orders" 
          isActive={isActive('/admin/orders')}
        />
        <SidebarItem 
          icon={Users} 
          label="Clientes" 
          href="/customers" 
          isActive={isActive('/customers')}
        />
        <SidebarItem 
          icon={Tag} 
          label="Configuração de Pixels" 
          href="/admin/pixel-settings" 
          isActive={isActive('/admin/pixel-settings')}
        />
        <SidebarItem 
          icon={Layout} 
          label="Personalizar Checkout" 
          href="/admin/checkout-customization" 
          isActive={isActive('/admin/checkout-customization')}
        />

        <div className="pt-4 border-t border-blue-700 mt-4">
          <p className="px-4 text-xs uppercase text-blue-300 font-semibold mb-2">
            Testes
          </p>
          <SidebarItem 
            icon={ShoppingCart} 
            label="Testar Checkout" 
            href="/checkout/test-product" 
            isActive={isActive('/checkout')}
          />
          <SidebarItem 
            icon={QrCode} 
            label="Testar Checkout Rápido" 
            href={`/quick-checkout/${testProductId}`} 
            isActive={isActive('/quick-checkout')}
          />
        </div>
      </div>
      
      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={logout}
          className="flex items-center w-full gap-3 px-4 py-2 text-sm text-blue-100 transition-colors rounded-md hover:bg-blue-700 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
