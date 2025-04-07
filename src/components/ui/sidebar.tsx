
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  Users,
  CreditCard,
  Home,
  LogOut,
  Settings,
  Sliders,
  DollarSign,
  Package,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const location = useLocation();
  // Check if current path starts with the href to handle nested routes
  const isActive = location.pathname === href || 
                   (href !== "/" && location.pathname.startsWith(href));

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center py-3 px-4 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200",
        isActive && "bg-gray-100 font-medium"
      )}
    >
      <Icon className="mr-3 h-5 w-5" />
      {label}
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-gray-200 min-h-screen hidden md:block bg-white">
      <div className="p-4">
        <Link to="/" className="text-xl font-bold flex items-center">
          <CreditCard className="mr-2 h-6 w-6 text-blue-600" />
          Painel Admin
        </Link>
      </div>
      <nav className="mt-6 px-2">
        <div className="space-y-1">
          <SidebarItem icon={Home} label="Página Inicial" href="/" />
          <SidebarItem icon={BarChart} label="Dashboard" href="/admin/dashboard" />
          <SidebarItem icon={Users} label="Clientes" href="/customers" />
          <SidebarItem icon={Package} label="Produtos" href="/admin/products" />
          <SidebarItem icon={ShoppingCart} label="Pedidos" href="/admin/orders" />
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
            Administração
          </p>
          <div className="space-y-1">
            <SidebarItem icon={DollarSign} label="Configurações de Pagamento" href="/admin/settings/payment" />
            <SidebarItem icon={Tag} label="Configurações de Pixel" href="/admin/pixel-settings" />
            <SidebarItem icon={Settings} label="Configurações Gerais" href="/settings" />
          </div>
        </div>
      </nav>
    </aside>
  );
};
