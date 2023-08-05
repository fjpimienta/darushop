import { CHARGE_OPENPAY_FRAGMENT_OBJECT } from '@graphql/operations/fragment/openpay/charge';
import gql from "graphql-tag";

export const LIST_CHARGES_OPENPAY = gql`
   query listChargesOpenpay {
    listChargesOpenpay {
      status
      message
      listChargesOpenpay {
        ...ChargeOpenpayObject
      }
    }
  }
  ${CHARGE_OPENPAY_FRAGMENT_OBJECT}
`;

export const ONE_CHARGE_OPENPAY = gql`
  query chargeOpenpay($idTransactionOpenpay: String) {
    chargeOpenpay(idTransactionOpenpay: $idTransactionOpenpay) {
      status
      message
      chargeOpenpay {
        ...ChargeOpenpayObject
      }
    }
  }
  ${CHARGE_OPENPAY_FRAGMENT_OBJECT}
`;

export const ADD_CHARGE_OPENPAY = gql`
  query($chargeOpenpay: ChargeOpenpayInput) {
    createChargeOpenpay(chargeOpenpay: $chargeOpenpay) {
      status
      message
      createChargeOpenpay {
        ...ChargeOpenpayObject
      }
    }
  }
  ${CHARGE_OPENPAY_FRAGMENT_OBJECT}
`;

export const CAPTURE_CHARGE_OPENPAY = gql`
  query($idChargeOpenpay: String,
        $captureTransactionOpenpay: CaptureChargeOpenpayInput) {
    captureChargeOpenpay(idChargeOpenpay: $idChargeOpenpay,
                  captureTransactionOpenpay: $captureTransactionOpenpay) {
        status
        message
        captureChargeOpenpay {
          ...ChargeOpenpayObject
        }
    }
  }
  ${CHARGE_OPENPAY_FRAGMENT_OBJECT}
`;
