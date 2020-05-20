import { makeOrderByPrisma2Compatible } from '../src/orderBy';

it('works', () => {
  expect(makeOrderByPrisma2Compatible({})).toBe(true);
});
