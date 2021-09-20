import React from 'react';
import {Container, Divider} from 'semantic-ui-react';
import ConnectedAppsSetting from './Inputs/ConnectedAppsSetting/ConnectedAppsSetting';
import LanguageSetting from './Inputs/LanguageSetting/LanguageSetting';
import DeleteAccount from './Inputs/DeleteAccount/DeleteAccount';
import Checkbox from './Inputs/Checkbox/Checkbox';
import Text from './Inputs/Text/Text';
import {get} from '../../../../../utils/TranslationUtils';
import styles from './SettingsEntry.module.css';


const SettingEntry = ({setting, onSettingUpdate}) => {
    const onChange = (event, target) => {
        onSettingUpdate(event, target, setting);
    };

    const customSettingsInputs = {
        ConnectedAppsToken: <ConnectedAppsSetting/>,
        Language: <LanguageSetting setting={setting} onChange={onChange}/>,
        DeleteAccount: <DeleteAccount setting={setting}/>
    };

    const inputsBySettingValueTypes = {
        'Checkbox': () => <Checkbox setting={setting} onChange={onChange}/>,
        'Text': () => <Text setting={setting} onChange={onChange}/>,
        'Custom': () => customSettingsInputs[setting.setting.name]
    };

    const SettingInput = inputsBySettingValueTypes[setting.setting.valueType];

    return (
        <Container fluid>
            <SettingInput/>
            <div className={styles.settingDescription}>
                {get(setting.setting.description, 'settings')}
            </div>
            <Divider hidden/>
        </Container>
    );
};

export default SettingEntry;
