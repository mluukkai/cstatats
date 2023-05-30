import { gql } from '@apollo/client';

export const REPOSITORY_BASE_FIELDS = gql`
  fragment repositoryBaseFields on Repository {
    id
    name
    ownerName
    fullName
    stargazersCount
    forksCount
    url
    ownerAvatarUrl
    description
    language
    createdAt
  }
`;

export const USER_BASE_FIELDS = gql`
  fragment userBaseFields on User {
    id
    username
    createdAt
  }
`;

export const REVIEW_BASE_FIELDS = gql`
  fragment reviewBaseFields on Review {
    id
    createdAt
    rating
    text
    userId
    repositoryId
  }
`;

export const PAGE_INFO_FIELDS = gql`
  fragment pageInfoFields on PageInfo {
    endCursor
    startCursor
    hasPreviousPage
    hasNextPage
  }
`;
