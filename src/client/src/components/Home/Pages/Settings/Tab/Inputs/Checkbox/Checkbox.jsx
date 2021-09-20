import React from 'react';
import {Checkbox} from 'semantic-ui-react';
import {asBoolean} from '../../../../../../../utils/SettingUtils';
import {get} from '../../../../../../../utils/TranslationUtils';


const CheckboxInput = ({setting, onChange}) => {
    return (
        <Checkbox toggle name={setting.setting.name}
                  label={get(setting.setting.label, 'settings')}
                  checked={asBoolean(setting.value)}
                  onChange={onChange}
        />
    );
};

export default CheckboxInput;
