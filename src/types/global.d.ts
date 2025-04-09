
declare global {
  interface Window {
    GA_TRACKING_ID?: string;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export {};
