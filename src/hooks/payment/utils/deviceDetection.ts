export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

export function detectDeviceType(): DeviceType {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(userAgent)) {
    return 'mobile';
  }

  if (/ipad|tablet|kindle|playbook/.test(userAgent)) {
    return 'tablet';
  }

  if (/windows|macintosh|linux/.test(userAgent)) {
    return 'desktop';
  }

  return 'unknown';
}
