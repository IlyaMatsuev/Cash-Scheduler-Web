import {gql} from '@apollo/client';

export default {
    GET_DASHBOARD_TRANSACTIONS_QUERY: 'GetDashboardTransactions',
    GET_TRANSACTIONS_BY_MONTH_QUERY: 'GetTransactionsByMonth',
    GET_DASHBOARD_TRANSACTIONS: gql`
        query GetDashboardTransactions($month: Int!, $year: Int!) {
            dashboardTransactions(month: $month, year: $year) {
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
                amount
                date
            }
            dashboardRecurringTransactions(month: $month, year: $year) {
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
                amount
                date
                nextTransactionDate
                interval
            }
        }
    `,
    GET_TRANSACTIONS_BY_MONTH: gql`
        query GetTransactionsByMonth($month: Int!, $year: Int!, $isRecurring: Boolean) {
            transactionsByMonth(month: $month, year: $year) {
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
            recurringTransactionsByMonth(month: $month, year: $year) {
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
            transactionsDelta(year: $year, isRecurring: $isRecurring) {
                month
                delta
            }
        }
    `
};
