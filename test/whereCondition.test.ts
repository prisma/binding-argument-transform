import { makeWherePrisma2Compatible } from '../src/whereConditions';

it('runs on basic cases', () => {
  expect(
    makeWherePrisma2Compatible({
      title_contains: 'searchstring',
      content_contains: 'searchstring',
    })
  ).toEqual({
    title: { contains: 'searchstring' },
    content: { contains: 'searchstring' },
  });

  expect(
    makeWherePrisma2Compatible({
      title_starts_with: 'searchstring',
      content_ends_with: 'searchstring',
    })
  ).toEqual({
    title: { startsWith: 'searchstring' },
    content: { endsWith: 'searchstring' },
  });

  expect(
    makeWherePrisma2Compatible({
      title_in: ['graphql', 'prisma'],
      content_in: 'searchstring',
      rating_in: [4, 5],
    })
  ).toEqual({
    title: { in: ['graphql', 'prisma'] },
    content: { in: 'searchstring' },
    rating: { in: [4, 5] },
  });
});

it('combines the properties of the same field', () => {
  expect(
    makeWherePrisma2Compatible({
      rating_lte: 5,
      rating_gt: 2,
      title_contains: 'searchstring',
    })
  ).toEqual({
    rating: {
      lte: 5,
      gt: 2,
    },
    title: { contains: 'searchstring' },
  });
});

it(`handles 'not_in' as a specific case`, () => {
  expect(
    makeWherePrisma2Compatible({
      title_not_in: ['graphql', 'prisma'],
    })
  ).toEqual({
    title: {
      not: {
        in: ['graphql', 'prisma'],
      },
    },
  });
  expect(
    makeWherePrisma2Compatible({
      title_not_in: ['graphql', 'prisma'],
      title_starts_with: 'searchstring',
    })
  ).toEqual({
    title: {
      startsWith: 'searchstring',
      not: {
        in: ['graphql', 'prisma'],
      },
    },
  });
});
