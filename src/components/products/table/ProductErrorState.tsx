
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ProductErrorStateProps {
  error: string;
  retryFetch: () => void;
  isOffline: boolean;
}

const ProductErrorState = ({ error, retryFetch, isOffline }: ProductErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
        <p className="text-red-600 font-medium mb-4">Error loading products: {error}</p>
        <p className="text-gray-600 mb-4">Check your internet connection and try again.</p>
        <Button 
          variant="default" 
          onClick={retryFetch}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
        {isOffline && (
          <p className="mt-4 text-sm text-amber-600">
            Offline mode active. Some products may be unavailable or outdated.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductErrorState;
