import {gql} from '@apollo/client';

export default {
    CREATE_CATEGORY: gql`
        mutation($category: NewCategoryInput!) {
            createCategory(category: $category) {
                id
                name
                type {
                    name
                }
                isCustom
                iconUrl
            }
        }
    `,
    UPDATE_CATEGORY: gql`
        mutation($category: UpdateCategoryInput!) {
            updateCategory(category: $category) {
                id
                name
                iconUrl
            }
        }
    `,
    DELETE_CATEGORY: gql`
        mutation($id: Int!) {
            deleteCategory(id: $id) {
                id
            }
        }
    `
};
