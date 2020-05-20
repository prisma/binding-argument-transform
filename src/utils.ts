const whereOptions = [
  '_not_in',
  '_not',
  '_in',
  '_lte',
  '_lt',
  '_gte',
  '_gt',
  '_not_contains',
  '_contains',
  '_not_starts_with',
  '_starts_with',
  '_not_ends_with',
  '_ends_with',
];

export const findOperator = (query: string): [string, number] => {
  const operator = whereOptions.find((op) => query.includes(op)) || query;

  const index = query.lastIndexOf(operator);
  return [operator, index];
};
