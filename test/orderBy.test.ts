import { makeOrderByPrisma2Compatible } from '../src/orderBy';

it('runs on basic cases', () => {
  expect(makeOrderByPrisma2Compatible('id_ASC')).toStrictEqual({
    id: 'asc',
  });
  expect(makeOrderByPrisma2Compatible('id_DESC')).toStrictEqual({
    id: 'desc',
  });
  expect(makeOrderByPrisma2Compatible('published_ASC')).toStrictEqual({
    published: 'asc',
  });
  expect(makeOrderByPrisma2Compatible('published_DESC')).toStrictEqual({
    published: 'desc',
  });
});

it('runs on underscored fields', () => {
  expect(makeOrderByPrisma2Compatible('first_name_ASC')).toStrictEqual({
    first_name: 'asc',
  });
  expect(makeOrderByPrisma2Compatible('total_price_DESC')).toStrictEqual({
    total_price: 'desc',
  });
});
