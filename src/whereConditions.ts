import { camelCase } from 'lodash';
import { findOperator, isNotPreceding } from './utils';

export const transformSpecialNotOperators = (operator: string, value: any) => {
  let [, modifiedOperator] = operator.split('_not');
  return {
    [camelCase(modifiedOperator)]: value,
  };
};

export const transformConditionals = (input: any) => {
  if (Array.isArray(input)) {
    const output = [];
    for (let item of input) {
      output.push(makeWherePrisma2Compatible(item));
    }
    return output;
  } else {
    return makeWherePrisma2Compatible(input);
  }
};

// TODO: relation based operators
export const makeWherePrisma2Compatible = (input: any): any => {
  const transformedWhere: any = {};

  for (let [key, val] of Object.entries(input)) {
    const [operator, index] = findOperator(key);

    // not any of P1 operators
    if (operator === key) {
      // perform transformation for special operators
      if (['AND', 'OR', 'NOT'].includes(operator)) {
        transformedWhere[operator] = transformConditionals(val);
      } else {
        transformedWhere[operator] = val;
      }
    } else {
      const field = key.slice(0, index);
      // handle the special `not` preceding operators
      if (isNotPreceding(operator)) {
        transformedWhere[field] = {
          ...transformedWhere[field],
          not: {
            ...transformedWhere[field]?.not,
            ...transformSpecialNotOperators(operator, val),
          },
        };
      } else {
        // transform P1 operators to P2
        const prisma2Operator = camelCase(operator.slice(1));
        transformedWhere[field] = {
          ...transformedWhere[field],
          [prisma2Operator]: val,
        };
      }
    }
  }

  return transformedWhere;
};
