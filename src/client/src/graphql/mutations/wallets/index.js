import {gql} from '@apollo/client';

export default {
    CREATE_WALLET: gql`
        mutation($wallet: NewWalletInput!) {
            createWallet(wallet: $wallet) {
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
        }
    `,
    UPDATE_WALLET: gql`
        mutation($wallet: UpdateWalletInput!) {
            updateWallet(wallet: $wallet) {
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
        }
    `,
    DELETE_WALLET: gql`
        mutation($id: Int!) {
            deleteWallet(id: $id) {
                id
            }
        }
    `,
    CREATE_TRANSFER: gql`
        mutation($transfer: NewTransferInput!) {
            createTransfer(transfer: $transfer) {
                sourceWallet {
                    id
                    balance
                }
                targetWallet {
                    id
                    balance
                }
            }
        }
    `,
};
