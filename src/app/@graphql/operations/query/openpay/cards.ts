import { CARD_OPENPAY_FRAGMENT_OBJECT } from '@graphql/operations/fragment/openpay/card';
import gql from "graphql-tag";

export const LIST_CARDS_OPENPAY = gql`
   query listCardsOpenpay {
    listCardsOpenpay {
      status
      message
      listCardsOpenpay {
        ...CardOpenpayObject
      }
    }
  }
  ${CARD_OPENPAY_FRAGMENT_OBJECT}
`;

export const ONE_CARD_OPENPAY = gql`
   query cardOpenpay($idCardOpenpay: String) {
    cardOpenpay(idCardOpenpay: $idCardOpenpay) {
      status
      message
      cardOpenpay {
        ...CardOpenpayObject
      }
    }
  }
  ${CARD_OPENPAY_FRAGMENT_OBJECT}
`;

export const ADD_CARD_OPENPAY = gql`
  query($cardOpenpay: CardOpenpayInput) {
    createCardOpenpay(cardOpenpay: $cardOpenpay) {
        status
        message
        createCardOpenpay {
          ...CardOpenpayObject
        }
    }
  }
  ${CARD_OPENPAY_FRAGMENT_OBJECT}
`;
