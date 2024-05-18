export const addSpacingForNumbers = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return null;
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
