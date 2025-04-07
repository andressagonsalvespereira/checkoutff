
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2, Save } from 'lucide-react';
import { useCheckoutCustomization } from '@/contexts/CheckoutCustomizationContext';
import BannerImageUpload from './BannerImageUpload';
import FormBasicFields from './FormBasicFields';
import FormColorFields from './FormColorFields';
import CheckoutPreview from './CheckoutPreview';
import { formSchema, FormValues } from './types';

const CheckoutCustomizationForm: React.FC = () => {
  const { customization, loading, updateCustomization } = useCheckoutCustomization();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      header_message: customization?.header_message || 'Oferta por tempo limitado!',
      banner_image_url: customization?.banner_image_url || '',
      show_banner: customization?.show_banner ?? true,
      button_color: customization?.button_color || '#3b82f6',
      button_text_color: customization?.button_text_color || '#ffffff',
      heading_color: customization?.heading_color || '#000000',
      button_text: customization?.button_text || 'Finalizar Pagamento',
    },
  });

  // Update form values when customization data is loaded
  React.useEffect(() => {
    if (customization) {
      form.reset({
        header_message: customization.header_message,
        banner_image_url: customization.banner_image_url,
        show_banner: customization.show_banner,
        button_color: customization.button_color,
        button_text_color: customization.button_text_color,
        heading_color: customization.heading_color,
        button_text: customization.button_text || 'Finalizar Pagamento',
      });
    }
  }, [customization, form]);

  const onSubmit = async (data: FormValues) => {
    await updateCustomization(data);
  };

  if (loading && !customization) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Carregando configurações...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização do Checkout</CardTitle>
        <CardDescription>
          Configure a aparência da página de checkout para melhorar a experiência do cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormBasicFields control={form.control} />
                <FormColorFields control={form.control} />
              </div>
              
              <div>
                <BannerImageUpload
                  name="banner_image_url"
                  control={form.control}
                  setValue={form.setValue}
                />
                
                <CheckoutPreview watch={form.watch} />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="flex items-center"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CheckoutCustomizationForm;
