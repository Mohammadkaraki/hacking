import { Resend } from 'resend';

// Lazy initialization to avoid errors during build
let _resendInstance: Resend | undefined;

export function getResendClient(): Resend {
  if (!_resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    _resendInstance = new Resend(apiKey);
  }
  return _resendInstance;
}

// Proxy object for backward compatibility - delays initialization
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResendClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});
