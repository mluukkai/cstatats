import React from 'react';
import { render, within } from '@testing-library/react-native';

import { RepositoryListContainer } from '../../components/RepositoryList';

const expectRepositoryItemToHaveCorrectInformation = (
  item,
  { name, description, languages, stars, forks, reviews, rating },
) => {
  const wrappedItem = within(item);

  expect(wrappedItem.getByText(name)).toBeDefined();
  expect(wrappedItem.getByText(description)).toBeDefined();
  expect(wrappedItem.getByText(languages)).toBeDefined();
  expect(wrappedItem.getByText(stars)).toBeDefined();
  expect(wrappedItem.getByText(forks)).toBeDefined();
  expect(wrappedItem.getByText(reviews)).toBeDefined();
  expect(wrappedItem.getByText(rating)).toBeDefined();
};

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

      const { getAllByTestId } = render(
        <RepositoryListContainer repositories={repositories} />,
      );

      const repositoryItems = getAllByTestId('repositoryItem');
      const [firstRepositoryItem, secondRepositoryItem] = repositoryItems;

      expectRepositoryItemToHaveCorrectInformation(firstRepositoryItem, {
        name: 'jaredpalmer/formik',
        description: 'Build forms in React, without the tears',
        languages: 'TypeScript',
        stars: '21.9k',
        forks: '1.6k',
        reviews: '3',
        rating: '88',
      });

      expectRepositoryItemToHaveCorrectInformation(secondRepositoryItem, {
        name: 'async-library/react-async',
        description: 'Flexible promise-based React data loader',
        languages: 'JavaScript',
        stars: '1.8k',
        forks: '69',
        reviews: '3',
        rating: '72',
      });
    });
  });
});
