import {gql} from '@apollo/client';

export default {
    GET_CURRENCIES: gql`
        query {
            currencies {
                abbreviation
                name
                iconUrl
            }
        }
    `,
    GET_RATES_BY_SOURCE_AND_TARGET: gql`
        query($source: String! $target: String!) {
            exchangeRates(sourceCurrencyAbbreviation: $source targetCurrencyAbbreviation: $target) {
                id
                exchangeRate
            }
        }
    `
};
