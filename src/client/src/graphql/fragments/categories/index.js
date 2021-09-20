import {gql} from '@apollo/client';

export default {
    NEW_CATEGORY: gql`
        fragment NewCategory on Category {
            id
            name
            type {
                name
            }
            isCustom
            iconUrl
        }
    `
};
