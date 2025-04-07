
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CardFormData } from '../../../payment-methods/CardForm';
import { PaymentProcessorProps, PaymentResult } from '../types';
import { DeviceType } from '@/types/order';

export interface CardProcessorParams {
  cardData: CardFormData;
  props: PaymentProcessorProps;
  setError: (error: string) => void;
  setPaymentStatus: (status: string | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  navigate: ReturnType<typeof useNavigate>;
  toast?: ReturnType<typeof useToast>['toast'];
  deviceType?: DeviceType;
}

export interface AutomaticProcessorParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  isSandbox: boolean;
  setPaymentStatus: (status: string | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  toast?: ReturnType<typeof useToast>['toast'];
  onSubmit?: (data: any) => void;
  brand?: string;
  deviceType?: DeviceType;
}

export interface ManualProcessorParams {
  cardData: CardFormData;
  formState: any;
  navigate: ReturnType<typeof useNavigate>;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  toast?: ReturnType<typeof useToast>['toast'];
  onSubmit?: (data: any) => void;
  brand?: string;
  deviceType?: DeviceType;
}
