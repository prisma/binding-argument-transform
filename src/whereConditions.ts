import { camelCase } from 'lodash';
import { findOperator, isNotPreceding, isRelationshipOperator } from './utils';

export const transformSpecialNotOperators = (operator: string, value: any) => {
  const [, modifiedOperator] = operator.split('_not');
  return {
    [camelCase(modifiedOperator)]: value,
  };
};

export const transformNestedOperators = (input: any) => {
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

export const makeWherePrisma2Compatible = (input: any): any => {
  if (typeof input === 'undefined') {
    return undefined;
  }
  const transformedWhere: any = {};

  for (let [key, val] of Object.entries(input)) {
    const [operator, index] = findOperator(key);

    // not any of P1 operators
    if (operator === key) {
      // perform transformation for logical operators
      if (['AND', 'OR', 'NOT'].includes(operator)) {
        transformedWhere[operator] = transformNestedOperators(val);
      } else {
        transformedWhere[operator] =
          typeof val === 'object' && !Array.isArray(val)
          ? transformNestedOperators(val)
          : val;
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
      } else if (isRelationshipOperator(operator)) {
        // handle relationship operators: `some`, `every`, `none`
        const prisma2Operator = camelCase(operator.slice(1));
        transformedWhere[field] = {
          ...transformedWhere[field],
          [prisma2Operator]: transformNestedOperators(val),
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
