type OrderType = 'asc' | 'desc';

export const makeOrderByPrisma2Compatible = (
  input: string
): Record<string, OrderType> => {
  const index = input.lastIndexOf('_');
  const [field, order] = [
    input.slice(0, index),
    input.slice(index + 1).toLocaleLowerCase() as OrderType,
  ];
  return {
    [field]: order,
  };
};
