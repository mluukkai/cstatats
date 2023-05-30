import { gql } from '@apollo/client';

import {
  USER_BASE_FIELDS,
  REVIEW_BASE_FIELDS,
  REPOSITORY_BASE_FIELDS,
} from './fragments';

export const AUTHENTICATE = gql`
  mutation authorize($credentials: AuthenticateInput!) {
    authenticate(credentials: $credentials) {
      accessToken
      user {
        ...userBaseFields
      }
    }
  }

  ${USER_BASE_FIELDS}
`;

export const CREATE_REVIEW = gql`
  mutation createReview($review: CreateReviewInput!) {
    createReview(review: $review) {
      ...reviewBaseFields
      repository {
        ...repositoryBaseFields
      }
    }
  }

  ${REVIEW_BASE_FIELDS}
  ${REPOSITORY_BASE_FIELDS}
`;

export const CREATE_USER = gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(user: $user) {
      ...userBaseFields
    }
  }
  ${USER_BASE_FIELDS}
`;

export const DELETE_REVIEW = gql`
  mutation deleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;
