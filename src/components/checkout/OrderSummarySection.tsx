
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, CheckCircle2, BadgeCheck } from 'lucide-react';

interface OrderSummarySectionProps {
  productDetails: ProductDetailsType;
}

interface ProductDetailsType {
  name: string;
  price: number;
  description: string;
  image: string;
  isDigital: boolean;
}

const OrderSummarySection = ({ productDetails }: OrderSummarySectionProps) => {
  // Se o produto for digital ou não precisar de frete, define como 0
  const shipping = 0; // Alterado para sempre ser grátis conforme solicitado
  const subtotal = productDetails.price;
  const total = subtotal + shipping;

  return (
    <div className="mb-8 border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">4</div>
        <h2 className="font-medium text-lg">Resumo do pedido</h2>
      </div>
      
      {/* Header do resumo da compra no estilo da imagem enviada */}
      <div className="flex items-center justify-between p-3 mb-3 bg-white border border-gray-200 rounded-md">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="font-semibold text-gray-800">Sua Compra</span>
        </div>
        <div className="flex items-center">
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2">1 item</span>
          <span className="font-semibold text-gray-800">R$ {productDetails.price.toFixed(2)}</span>
        </div>
      </div>
      
      <Card className="mb-4 shadow-sm border-green-50">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3 border">
              <img 
                src={productDetails.image} 
                alt={productDetails.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">{productDetails.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{productDetails.description.substring(0, 80)}{productDetails.description.length > 80 ? '...' : ''}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-3 mb-3">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Subtotal</span>
              <span>R${subtotal.toFixed(2)}</span>
            </div>
            
            {/* Only show shipping information for physical products */}
            {!productDetails.isDigital && (
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Frete</span>
                <span className="text-green-600 font-medium flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Grátis
                </span>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-t border-gray-100 mt-2">
              <span className="text-gray-800 font-medium">Total</span>
              <span className="text-black font-bold text-lg">R${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
            <BadgeCheck className="h-3 w-3 mr-1 text-green-600" />
            <span>Compra segura e protegida</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummarySection;
