import {gql} from '@apollo/client';

export default {
    UPDATE_SETTING: gql`
        mutation($setting: UpdateUserSettingInput!) {
            updateUserSetting(setting: $setting) {
                id
                value
                setting {
                    name
                    unitName
                }
            }
        }
    `,
    UPDATE_SETTINGS: gql`
        mutation($settings: [UpdateUserSettingInput!]!) {
            updateUserSettings(settings: $settings) {
                id
                value
                setting {
                    name
                    unitName
                }
            }
        }
    `
};
