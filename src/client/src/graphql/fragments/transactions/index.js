import {gql} from '@apollo/client';

export default {
    NEW_TRANSACTION: gql`
        fragment NewTransaction on Transaction {
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
    `,
    NEW_RECURRING_TRANSACTION: gql`
        fragment NewRecurringTransaction on RegularTransaction {
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
    `,
    UPDATED_TRANSACTION: gql`
        fragment UpdateTransaction on Transaction {
            id
            title
            amount
            date
        }
    `,
    UPDATED_RECURRING_TRANSACTION: gql`
        fragment UpdateRecurringTransaction on RegularTransaction {
            id
            title
            amount
        }
    `
};
