type OrderType = 'asc' | 'desc';

type Input = string | undefined;

export const makeOrderByPrisma2Compatible = (
  input: Input
): Record<string, OrderType> | undefined => {
  if (!input) {
    return undefined;
  }
  const index = input.lastIndexOf('_');
  const [field, order] = [
    input.slice(0, index),
    input.slice(index + 1).toLocaleLowerCase() as OrderType,
  ];
  return {
    [field]: order,
  };
};
