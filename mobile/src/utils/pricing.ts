const SIZE_ORDER = ['S', 'M', 'L', 'XL'] as const;
const SIZE_STEP_MULTIPLIER = 1.15;

export const getSizePrice = (basePrice: number, size: string) => {
  const normalizedSize = size?.toUpperCase?.() || 'S';
  const sizeIndex = SIZE_ORDER.indexOf(normalizedSize as (typeof SIZE_ORDER)[number]);

  if (sizeIndex <= 0) {
    return basePrice;
  }

  return Number((basePrice * Math.pow(SIZE_STEP_MULTIPLIER, sizeIndex)).toFixed(2));
};

export const getSizePriceLabel = (basePrice: number, size: string) =>
  `$${getSizePrice(basePrice, size).toFixed(2)}`;
