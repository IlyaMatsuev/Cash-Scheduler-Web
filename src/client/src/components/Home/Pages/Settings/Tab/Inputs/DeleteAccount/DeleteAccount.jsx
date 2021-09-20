import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {Button, Confirm, Segment} from 'semantic-ui-react';
import DeleteAccountConfirm from './DeleteAccountConfirm/DeleteAccountConfirm';
import {onUIErrors} from '../../../../../../../utils/GlobalUtils';
import {get} from '../../../../../../../utils/TranslationUtils';
import userMutations from '../../../../../../../graphql/mutations/users';
import settingQueries from '../../../../../../../graphql/queries/settings';
import {toast} from 'react-semantic-toasts';
import {notifications} from '../../../../../../../config';
import {removeEntityCache} from '../../../../../../../utils/CacheUtils';


const DeleteAccount = ({setting}) => {
    const initState = {
        deleteConfirmOpen: false,
        password: ''
    };
    const [state, setState] = useState(initState);
    const [errors, setErrors] = useState({});

    const [
        deleteUser,
        {loading: deleteUserLoading}
    ] = useMutation(userMutations.DELETE_USER, {
        onCompleted: () => {
            onConfirmModalToggle();
            toast({
                title: get('deleteAccountTitle', 'notifications'),
                description: get('deleteAccountDescription', 'notifications'),
                type: 'warning',
                icon: 'info',
                color: 'grey',
                time: notifications.toastDuration
            });
        },
        onError: error => onUIErrors(error, setErrors, errors),
        update: cache => {
            const {settings} = cache.readQuery({
                query: settingQueries.GET_SETTINGS,
                variables: {unitName: 'General'}
            });
            const deleteAccountSettings = settings.find(s => s.setting.name === 'DeleteAccount');
            removeEntityCache(cache, deleteAccountSettings, ['settings']);
        },
        variables: {password: state.password}
    });

    const onChange = (event, {name, value}) => {
        setState({...state, [name]: value});
        setErrors({...errors, [name]: undefined});
    };

    const onConfirmModalToggle = () => {
        setState({deleteConfirmOpen: !state.deleteConfirmOpen});
        setErrors({});
    };

    const onConfirmDelete = () => {
        deleteUser();
    };

    return (
        <Segment basic>
            <Button.Group>
                <Button inverted color="red"
                        onClick={onConfirmModalToggle}
                        content={get(setting.setting.label, 'settings')}
                />
            </Button.Group>

            <Confirm open={state.deleteConfirmOpen} className="modalContainer"
                     header={get(setting.setting.label, 'settings')}
                     content={<DeleteAccountConfirm state={state} errors={errors} onChange={onChange}/>}
                     cancelButton={<Button basic content={get('cancel')}/>}
                     confirmButton={
                         <Button basic negative loading={deleteUserLoading}
                                 disabled={!state.password}
                                 content={get('confirmDelete')}
                         />
                     }
                     onCancel={onConfirmModalToggle}
                     onConfirm={onConfirmDelete}
            />
        </Segment>
    );
};

export default DeleteAccount;
