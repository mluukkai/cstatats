import { gql } from '@apollo/client';

import {
  REPOSITORY_BASE_FIELDS,
  USER_BASE_FIELDS,
  REVIEW_BASE_FIELDS,
  PAGE_INFO_FIELDS,
} from './fragments';

export const GET_REPOSITORIES = gql`
  query getRepositories(
    $orderBy: AllRepositoriesOrderBy
    $orderDirection: OrderDirection
    $first: Int
    $after: String
    $searchKeyword: String
  ) {
    repositories(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
      after: $after
      searchKeyword: $searchKeyword
    ) {
      totalCount
      edges {
        node {
          ...repositoryBaseFields
          ratingAverage
          reviewCount
        }
        cursor
      }
      pageInfo {
        ...pageInfoFields
      }
    }
  }

  ${REPOSITORY_BASE_FIELDS}
  ${PAGE_INFO_FIELDS}
`;

export const GET_CURRENT_USER = gql`
  query getCurrentUser(
    $includeReviews: Boolean = false
    $reviewsFirst: Int
    $reviewsAfter: String
  ) {
    me {
      ...userBaseFields
      reviews(first: $reviewsFirst, after: $reviewsAfter)
        @include(if: $includeReviews) {
        totalCount
        edges {
          node {
            ...reviewBaseFields
            user {
              ...userBaseFields
            }
            repository {
              ...repositoryBaseFields
            }
          }
          cursor
        }
        pageInfo {
          ...pageInfoFields
        }
      }
    }
  }

  ${USER_BASE_FIELDS}
  ${PAGE_INFO_FIELDS}
  ${REPOSITORY_BASE_FIELDS}
  ${REVIEW_BASE_FIELDS}
`;

export const GET_REPOSITORY = gql`
  query getRepository($id: ID!, $reviewsFirst: Int, $reviewsAfter: String) {
    repository(id: $id) {
      ...repositoryBaseFields
      ratingAverage
      reviewCount
      reviews(first: $reviewsFirst, after: $reviewsAfter) {
        totalCount
        edges {
          node {
            ...reviewBaseFields
            user {
              ...userBaseFields
            }
            repository {
              ...repositoryBaseFields
            }
          }
          cursor
        }
        pageInfo {
          ...pageInfoFields
        }
      }
    }
  }

  ${REPOSITORY_BASE_FIELDS}
  ${REVIEW_BASE_FIELDS}
  ${USER_BASE_FIELDS}
  ${PAGE_INFO_FIELDS}
`;
