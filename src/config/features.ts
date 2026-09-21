/**
 * Feature flags. A flagged-off section renders nothing and is left out of the
 * nav and the sitemap.
 */
export const features = {
  /** Turn on when the first real product file exists in src/content/products/. */
  products: false,
  /** /recursos */
  blog: false,
} as const;

export type FeatureFlag = keyof typeof features;
