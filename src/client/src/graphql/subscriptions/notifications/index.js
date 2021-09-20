import {gql} from '@apollo/client';

export default {
    ON_NOTIFICATION_CREATED: gql`
        subscription($userId: Int!) {
            onNotificationCreated(userId: $userId) {
                id
                title
                content
                isRead
                createdDate
            }
        }
    `
};
