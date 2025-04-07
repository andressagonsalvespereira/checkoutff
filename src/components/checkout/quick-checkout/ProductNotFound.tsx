
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ProductNotFoundProps {
  slug?: string;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ slug }) => {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">
            {slug 
              ? `We couldn't find a product with the identifier "${slug}".`
              : "We couldn't find the requested product."}
          </p>
          <div className="text-sm text-gray-500">
            If you followed a link, it may be incorrect or the product may have been removed.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductNotFound;
