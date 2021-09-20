import {gql} from '@apollo/client';

export default {
    GET_WALLETS: gql`
        query {
            wallets {
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
    `
};
