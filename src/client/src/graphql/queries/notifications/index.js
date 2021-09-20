import {gql} from '@apollo/client';

export default {
    GET_NOTIFICATIONS: gql`
        query {
            unreadNotificationsCount
            notifications {
                id
                title
                content
                isRead
                createdDate
            }
        }
    `
};
