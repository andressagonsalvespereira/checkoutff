
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ProductLoadingStateProps {
  retryFetch: () => void;
}

const ProductLoadingState = ({ retryFetch }: ProductLoadingStateProps) => {
  const [loadingTimeExceeded, setLoadingTimeExceeded] = useState(false);
  
  useEffect(() => {
    // Set a timeout to show an error message if loading takes too long
    const timeoutId = window.setTimeout(() => {
      setLoadingTimeExceeded(true);
    }, 10000); // Show error after 10 seconds of loading
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
        <p className="text-center text-gray-500">Loading products...</p>
        
        {loadingTimeExceeded && (
          <div className="mt-4 text-center">
            <p className="text-amber-600 mb-2">Loading is taking longer than expected.</p>
            <Button 
              variant="outline" 
              onClick={retryFetch}
              className="bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductLoadingState;
