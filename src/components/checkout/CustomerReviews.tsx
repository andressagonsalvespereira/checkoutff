
import React, { useMemo } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CustomerReviews = () => {
  // Generate random timestamps for each review to make it look more authentic
  const timestamps = useMemo(() => {
    const now = new Date();
    
    // Generate random times within the last 48 hours
    return [
      new Date(now.getTime() - Math.floor(Math.random() * 60) * 60000), // Random minutes ago (up to 1 hour)
      new Date(now.getTime() - (Math.floor(Math.random() * 24) + 1) * 3600000), // Random hours ago (1-24 hours)
      new Date(now.getTime() - (Math.floor(Math.random() * 48) + 24) * 3600000), // Random time between 1-2 days ago
    ];
  }, []);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Depoimentos</h3>
        <span className="text-gray-500 text-sm">3 comentários</span>
      </div>
      
      {/* Primeiro Depoimento */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src="https://randomuser.me/api/portraits/men/72.jpg" 
              alt="Reinaldo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
              <div className="flex flex-col">
                <p className="font-medium">Reinaldo martins da silva</p>
                <span className="text-xs text-gray-500">
                  {formatDistance(timestamps[0], new Date(), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center mt-1 sm:mt-0">
                <span className="text-sm text-gray-500 mr-2">Foi útil?</span>
                <button className="mr-1 p-1" aria-label="Não foi útil">
                  <ThumbsDown className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1" aria-label="Foi útil">
                  <ThumbsUp className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700">Estou muito satisfeito com o serviço, realmente entregam o que promete</p>
          </div>
        </div>
      </div>
      
      {/* Segundo Depoimento */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src="https://randomuser.me/api/portraits/women/33.jpg" 
              alt="Juliana" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
              <div className="flex flex-col">
                <p className="font-medium">juliana nascimento</p>
                <span className="text-xs text-gray-500">
                  {formatDistance(timestamps[1], new Date(), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center mt-1 sm:mt-0">
                <span className="text-sm text-gray-500 mr-2">Foi útil?</span>
                <button className="mr-1 p-1" aria-label="Não foi útil">
                  <ThumbsDown className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1" aria-label="Foi útil">
                  <ThumbsUp className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700">melhor investimento que fiz, tenho tudo na minha tv e celular por um valor simbólico, obrigado por existir cineflick s2</p>
          </div>
        </div>
      </div>
      
      {/* Terceiro Depoimento */}
      <div>
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src="https://randomuser.me/api/portraits/women/68.jpg" 
              alt="Rafaela" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
              <div className="flex flex-col">
                <p className="font-medium">Rafaela pires</p>
                <span className="text-xs text-gray-500">
                  {formatDistance(timestamps[2], new Date(), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center mt-1 sm:mt-0">
                <span className="text-sm text-gray-500 mr-2">Foi útil?</span>
                <button className="mr-1 p-1" aria-label="Não foi útil">
                  <ThumbsDown className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1" aria-label="Foi útil">
                  <ThumbsUp className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700">Estou amando esse aplicativo, muito bom!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
