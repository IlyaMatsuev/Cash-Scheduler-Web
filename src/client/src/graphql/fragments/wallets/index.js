import {gql} from '@apollo/client';

export default {
    NEW_WALLET: gql`
        fragment NewWallet on Wallet {
            id
            name
            balance
            currency {
                abbreviation
                name
                iconUrl
            }
            isDefault
        }
    `,
    UPDATE_WALLET: gql`
        fragment UpdateWallet on Wallet {
            id
            name
            balance
            currency {
                abbreviation
                name
                iconUrl
            }
            isDefault
        }
    `,
    UPDATE_WALLET_AFTER_TRANSFER: gql`
        fragment UpdateWalletAfterTransfer on Wallet {
            id
            balance
        }
    `
};
