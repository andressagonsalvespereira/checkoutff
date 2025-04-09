
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <Home className="w-5 h-5" />
            <span className="font-semibold">Home</span>
          </Link>
          
          <div>
            {isAuthenticated ? (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <User className="w-5 h-5" />
                <span>Painel Admin</span>
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <User className="w-5 h-5" />
                <span>Entrar como Admin</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
