
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface ProductDetailsType {
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CheckoutSuccessProps {
  productDetails: ProductDetailsType;
}

const CheckoutSuccess = ({ productDetails }: CheckoutSuccessProps) => {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-green-200">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="rounded-full bg-green-100 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Obrigado pela sua compra!</h3>
            <p className="text-gray-600 mb-6">
              Você receberá um email de confirmação em breve com os detalhes da sua compra.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-lg mb-2">Resumo do pedido</h4>
              <div className="flex justify-between mb-2">
                <span>Produto:</span>
                <span>{productDetails.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total:</span>
                <span className="font-bold">R$ {productDetails.price.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = "/"}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Voltar para a loja
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
