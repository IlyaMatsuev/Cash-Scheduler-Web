import {gql} from '@apollo/client';

export default {
    NEW_NOTIFICATION: gql`
        fragment NewNotification on UserNotification {
            id
            title
            content
            isRead
            createdDate
        }
    `,
    TOGGLE_NOTIFICATION: gql`
        fragment ToggleNotification on UserNotification {
            isRead
        }
    `
};
