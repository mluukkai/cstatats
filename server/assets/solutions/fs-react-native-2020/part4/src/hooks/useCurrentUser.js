import { useQuery } from '@apollo/client';

import { GET_CURRENT_USER } from '../graphql/queries';

const useCurrentUser = (variables) => {
  const { data, ...rest } = useQuery(GET_CURRENT_USER, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return { currentUser: data?.me, ...rest };
};

export default useCurrentUser;
