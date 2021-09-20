import React from 'react';
import {Container, Input} from 'semantic-ui-react';
import ErrorsList from '../../../../../../../../utils/ErrorsList';
import {get} from '../../../../../../../../utils/TranslationUtils';


const DeleteAccountConfirm = ({state: {password = ''}, errors, onChange}) => {
    return (
        <Container fluid textAlign="center" className="py-3">
            <Container text textAlign="left"
                       content={get('confirmDeleteAccountMessage', 'settings')}
                       className="mb-2"
            />
            <Input fluid placeholder={get('confirmDeleteAccountInput', 'settings')}
                   type="password" name="password"
                   onChange={onChange}
                   value={password} error={!!errors.password}
            />
            <ErrorsList errors={errors}/>
        </Container>
    );
};

export default DeleteAccountConfirm;
