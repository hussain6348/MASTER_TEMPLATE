export const clientConfig = {
  businessName: 'Huzada Market',
  tagline: 'Useful finds. Simple ordering.',
  description: 'Browse the catalog and place your order directly through WhatsApp.',
  whatsappNumber: '923001234567', // e.g. 923001234567 (no + or spaces)
  currency: 'PKR',
  currencySymbol: 'Rs.',
  locale: 'en-PK',
  primaryColor: '#1d4ed8',
  secondaryColor: '#0f172a',
  supportEmail: 'hello@example.com',
  catalogLabel: 'Featured products',
} as const;

export type ClientConfig = typeof clientConfig;
