import {gql} from '@apollo/client';

export default {
    GET_SETTINGS: gql`
        query($unitName: String) {
            settings(unitName: $unitName) {
                id
                value
                setting {
                    name
                    label
                    unitName
                    sectionName
                    valueType
                    description
                }
            }
        }
    `,
    GET_ALL_USER_SETTINGS: gql`
        query($unitName: String) {
            settingNames
            settingUnits
            settingSections
            settings(unitName: $unitName) {
                id
                value
                setting {
                    name
                    label
                    unitName
                    sectionName
                    valueType
                    description
                }
            }
        }
    `,
    GET_AVAILABLE_LANGUAGES: gql`
        query {
            languages {
                abbreviation
                name
                iconUrl
            }
        }
    `
};
