import {gql} from '@apollo/client';

export default {
    CREATE_EXCHANGE_RATE: gql`
        mutation($exchangeRate: NewExchangeRateInput!) {
            createExchangeRate(exchangeRate: $exchangeRate) {
                id
            }
        }
    `
}
