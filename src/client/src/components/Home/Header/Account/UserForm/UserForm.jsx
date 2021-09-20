import React from 'react';
import {Button, Form} from 'semantic-ui-react';
import {toFloat} from '../../../../../utils/GlobalUtils';
import {get} from '../../../../../utils/TranslationUtils';


const UserForm = ({user, errors, onUserChange, onUserUpdate}) => {
    return (
        <Form onSubmit={onUserUpdate}>
            <Form.Input icon="user" label={get('firstName', 'account')}
                        labelPosition="left" type="text" name="firstName"
                        value={user.firstName} error={errors.firstName}
                        onChange={onUserChange}
            />
            <Form.Input icon="user" label={get('lastName', 'account')}
                        type="text" name="lastName"
                        value={user.lastName} error={errors.lastName}
                        onChange={onUserChange}
            />
            <Form.Input icon="mail" label={get('email', 'account')}
                        type="text" disabled name="emailName"
                        value={user.email}
            />
            <Form.Input icon="dollar" label={get('balance', 'account')}
                        type="number" name="balance"
                        value={toFloat(user.balance)} error={errors.balance}
                        onChange={onUserChange}
            />
            <Button primary fluid content={get('save')}/>
        </Form>
    );
};

export default UserForm;
