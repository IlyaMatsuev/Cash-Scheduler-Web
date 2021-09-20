import {gql} from '@apollo/client';

export default {
    NEW_SETTING_VALUE: gql`
        fragment NewSettingValue on UserSetting {
            value
        }
    `
};
