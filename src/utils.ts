const relationshipOperators = ['_some', '_every', '_none'];

const notOperatorOptions = [
  '_not_contains',
  '_not_starts_with',
  '_not_ends_with',
];

const whereOptions = [
  '_not_in',
  ...notOperatorOptions,
  ...relationshipOperators,
  '_not',
  '_in',
  '_lte',
  '_lt',
  '_gte',
  '_gt',
  '_contains',
  '_starts_with',
  '_ends_with',
];

export const findOperator = (query: string): [string, number] => {
  const operator = whereOptions.find((op) => query.endsWith(op)) || query;

  const index = query.lastIndexOf(operator);
  return [operator, index];
};

export const isNotPreceding = (operator: string) => {
  return notOperatorOptions.some((option) => operator.endsWith(option));
};

export const isRelationshipOperator = (operator: string) => {
  return relationshipOperators.some((option) => operator.endsWith(option));
};
