import {gql} from '@apollo/client';

export default {
    TOGGLE_READ_NOTIFICATION: gql`
        mutation($id: Int!, $read: Boolean!) {
            toggleReadNotification(id: $id, read: $read) {
                id
                isRead
            }
        }
    `
};
