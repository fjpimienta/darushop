import gql from 'graphql-tag';

export const CONFIG_FRAGMENT = gql`
  fragment ConfigObject on Config {
    id
    message
    exchange_rate
    offer
  }
`;
