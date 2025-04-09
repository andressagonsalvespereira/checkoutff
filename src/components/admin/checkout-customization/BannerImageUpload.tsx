
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Control } from 'react-hook-form';
import { Upload, X, Link } from 'lucide-react';
import { useCheckoutCustomization } from '@/contexts/CheckoutCustomizationContext';
import { Input } from '@/components/ui/input';

interface BannerImageUploadProps {
  name: string;
  control: Control<any>;
  setValue: (name: string, value: string) => void;
}

const BannerImageUpload: React.FC<BannerImageUploadProps> = ({
  name,
  control,
  setValue
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { uploadBannerImage } = useCheckoutCustomization();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setUploading(true);

    try {
      const imageUrl = await uploadBannerImage(file);
      if (imageUrl) {
        setValue(name, imageUrl);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setValue(name, imageUrl);
      setImageUrl('');
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Imagem do Banner</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {field.value && (
                <div className="relative">
                  <img 
                    src={field.value}
                    alt="Banner preview"
                    className="w-full h-auto rounded-md object-cover max-h-40"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setValue(name, '')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="space-y-4">
                {/* External URL input */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Usar URL externa</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={handleUrlSubmit}
                      disabled={!imageUrl}
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Usar
                    </Button>
                  </div>
                </div>

                {/* File upload option */}
                <div className="flex items-center">
                  <label className="text-sm font-medium">Ou fazer upload</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <label htmlFor="banner-upload">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      asChild
                      className="cursor-pointer"
                    >
                      <div>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Enviando...' : 'Enviar Banner'}
                      </div>
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Escolha uma imagem para o banner do checkout usando uma URL externa ou fazendo upload. Recomendamos imagens com proporção 10:3 para melhor visualização.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BannerImageUpload;
