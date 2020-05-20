import { camelCase } from 'lodash';
import { findOperator } from './utils';

// TODO: remaining operators: AND, OR, NOT
export const makeWherePrisma2Compatible = (input: any): any => {
  const transformedWhere: any = {};

  for (let [key, val] of Object.entries(input)) {
    const [operator, index] = findOperator(key);

    if (operator === key) {
      transformedWhere[operator] = val;
    } else {
      const field = key.slice(0, index);
      const prisma2Operator = camelCase(operator.slice(1));
      // perform transformation for special operators
      if (operator === '_not_in') {
        transformedWhere[field] = {
          ...transformedWhere[field],
          not: {
            in: val,
          },
        };
      } else {
        transformedWhere[field] = {
          ...transformedWhere[field],
          [prisma2Operator]: val,
        };
      }
    }
  }

  return transformedWhere;
};
