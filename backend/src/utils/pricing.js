const SIZE_ORDER = ['S', 'M', 'L', 'XL'];
const SIZE_STEP_MULTIPLIER = 1.15;

const getSizePrice = (basePrice, size = 'S') => {
  const normalizedSize = String(size || 'S').toUpperCase();
  const sizeIndex = SIZE_ORDER.indexOf(normalizedSize);

  if (sizeIndex <= 0) {
    return basePrice;
  }

  return Number((basePrice * Math.pow(SIZE_STEP_MULTIPLIER, sizeIndex)).toFixed(2));
};

module.exports = {
  getSizePrice
};
