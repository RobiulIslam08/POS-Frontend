/**
 * App Configuration
 * -----------------
 * Change these values to customize the POS for different customers.
 * No need to touch any other code — just update this file.
 */

export const APP_CONFIG = {
  /** Store identity */
  storeName: {
    en: "Abdullah Ibrahim Ahmed Aseeri Plastic Products Store",
    ar: "محل عبدالله ابراهيم احمد عسيري للمنتجات البلاستيكية",
  },

  /** Currency */
  currency: "SR",

  /** Default VAT percentage */
  vatPercent: 15,

  /** Default language: 'en' | 'ar' */
  defaultLanguage: "en",

  /** Supported languages */
  supportedLanguages: ["en", "ar"],

  /** Default payment mode */
  defaultPaymentMode: "CREDIT CARD",

  /** Backend API base URL */
  apiBaseUrl: "http://localhost:5100/api/v1",

  /** Date/time locale */
  dateLocale: "en-GB",
  timeLocale: "en-US",
};
