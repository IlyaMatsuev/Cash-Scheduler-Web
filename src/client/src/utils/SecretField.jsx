import React, {useState} from 'react';
import {Form} from 'semantic-ui-react';

const SecretField = ({value, error, onChange}) => {

    const [state, setState] = useState({
        shown: false
    });

    const onShowFieldClick = event => {
        event.preventDefault();
    };

    const onShowFieldEnter = event => {
        event.preventDefault();
        setState({...state, shown: true});
    };

    const onShowFieldLeave = event => {
        event.preventDefault();
        setState({...state, shown: false});
    };

    return (
        <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password"
                    type={state.shown ? 'text' : 'password'}
                    action={{icon: 'eye',
                        onClick: onShowFieldClick,
                        onMouseUp: onShowFieldLeave,
                        onMouseLeave: onShowFieldLeave,
                        onMouseDown: onShowFieldEnter}}
                    name="password" value={value} error={error} onChange={onChange}/>
    );
}

export default SecretField;
