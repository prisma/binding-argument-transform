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

it('works on enum types correctly', () => {
  expect(
    makeWherePrisma2Compatible({
      type: 'USER',
      status_not: 'ACTIVE',
    })
  ).toEqual({
    type: 'USER',
    status: { not: 'ACTIVE' },
  });

  expect(
    makeWherePrisma2Compatible({
      type_in: ['ADMIN', 'SUPERADMIN'],
      status_not_in: ['DELETED', 'DEACTIVATED'],
    })
  ).toEqual({
    type: { in: ['ADMIN', 'SUPERADMIN'] },
    status: { notIn: ['DELETED', 'DEACTIVATED'] },
  });
});

it(`handles 'not' preceding operators as a special case`, () => {
  expect(
    makeWherePrisma2Compatible({
      title_not_in: ['graphql', 'prisma'],
    })
  ).toEqual({
    title: {
      notIn: ['graphql', 'prisma'],
    },
  });

  expect(
    makeWherePrisma2Compatible({
      title_not_in: ['graphql', 'prisma'],
      title_not_starts_with: 'searchstring',
    })
  ).toEqual({
    title: {
      notIn: ['graphql', 'prisma'],
      not: {
        startsWith: 'searchstring',
      },
    },
  });

  expect(
    makeWherePrisma2Compatible({
      title_not_contains: 'this',
      title_not_starts_with: 'searchstring',
    })
  ).toEqual({
    title: {
      not: {
        startsWith: 'searchstring',
        contains: 'this',
      },
    },
  });
});

it(`correctly functions on 'AND', 'OR' and 'NOT' operators`, () => {
  expect(
    makeWherePrisma2Compatible({
      OR: [
        { title_contains: 'searchString' },
        { content_contains: 'searchString' },
      ],
    })
  ).toEqual({
    OR: [
      { title: { contains: 'searchString' } },
      { content: { contains: 'searchString' } },
    ],
  });

  expect(
    makeWherePrisma2Compatible({
      content_contains: 'searchString',
      OR: { title_contains: 'searchString' },
    })
  ).toEqual({
    content: {
      contains: 'searchString',
    },
    OR: { title: { contains: 'searchString' } },
  });

  expect(
    makeWherePrisma2Compatible({
      AND: [
        { email: 'email' },
        {
          OR: [{ name_starts_with: 'first' }, { name_ends_with: 'last' }],
        },
      ],
    })
  ).toEqual({
    AND: [
      { email: 'email' },
      {
        OR: [{ name: { startsWith: 'first' } }, { name: { endsWith: 'last' } }],
      },
    ],
  });
});
