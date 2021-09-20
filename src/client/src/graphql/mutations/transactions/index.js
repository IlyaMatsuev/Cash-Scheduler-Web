import {gql} from '@apollo/client';

export default {
    CREATE_TRANSACTION: gql`
        mutation($transaction: NewTransactionInput!) {
            createTransaction(transaction: $transaction) {
                id
                title
                category {
                    id
                    name
                    type {
                        name
                        iconUrl
                    }
                    iconUrl
                }
                wallet {
                    id
                    name
                    currency {
                        abbreviation
                        iconUrl
                    }
                }
                amount
                date
            }
        }
    `,
    UPDATE_TRANSACTION: gql`
        mutation($transaction: UpdateTransactionInput!) {
            updateTransaction(transaction: $transaction) {
                id
                title
                amount
                date
            }
        }
    `,
    DELETE_TRANSACTION: gql`
        mutation($id: Int!) {
            deleteTransaction(id: $id) {
                id
            }
        }
    `,
    CREATE_RECURRING_TRANSACTION: gql`
        mutation($transaction: NewRecurringTransactionInput!) {
            createRegularTransaction(transaction: $transaction) {
                id
                title
                category {
                    id
                    name
                    type {
                        name
                        iconUrl
                    }
                    iconUrl
                }
                wallet {
                    id
                    name
                    currency {
                        abbreviation
                        iconUrl
                    }
                }
                amount
                date
                nextTransactionDate
                interval
            }
        }
    `,
    UPDATE_RECURRING_TRANSACTION: gql`
        mutation($transaction: UpdateRecurringTransactionInput!) {
            updateRegularTransaction(transaction: $transaction) {
                id
                title
                amount
            }
        }
    `,
    DELETE_RECURRING_TRANSACTION: gql`
        mutation($id: Int!) {
            deleteRegularTransaction(id: $id) {
                id
            }
        }
    `
};
