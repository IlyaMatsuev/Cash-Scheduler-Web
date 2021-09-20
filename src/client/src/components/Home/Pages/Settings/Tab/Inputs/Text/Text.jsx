import React from 'react';
import {Input} from 'semantic-ui-react';


const TextInput = ({setting, onChange}) => {
    return (
        <Input type="text"
               name={setting.setting.name}
               label={setting.setting.label}
               value={setting.value}
               onChange={onChange}
        />
    );
};

export default TextInput;
