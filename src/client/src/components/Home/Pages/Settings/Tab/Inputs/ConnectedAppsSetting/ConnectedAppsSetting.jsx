import React, {useState} from 'react';
import {Button, Confirm, Input, Segment} from 'semantic-ui-react';
import {useQuery, useMutation} from '@apollo/client';
import userQueries from '../../../../../../../graphql/queries/users';
import userMutations from '../../../../../../../graphql/mutations/users';
import {toast} from 'react-semantic-toasts';
import {get} from '../../../../../../../utils/TranslationUtils';
import {notifications} from '../../../../../../../config';
import styles from './ConnectedAppsSetting.module.css';


const ConnectedAppsSetting = () => {
    const initState = {
        isTokenCopied: false,
        isTokenHidden: true,
        appsLogoutConfirmModalOpen: false
    };
    const [state, setState] = useState(initState);

    const {
        loading: appTokenQueryLoading,
        error: appTokenQueryError,
        data: appTokenQueryData,
        refetch: refetchAppToken
    } = useQuery(userQueries.GET_APP_TOKEN);

    const [
        appsLogout,
        {loading: appsLogoutLoading, error: appsLogoutError}
    ] = useMutation(userMutations.LOGOUT_CONNECTED_APPS, {
        onCompleted: () => {
            toast({
                title: get('successTitle', 'notifications'),
                description: get('logOutFromConnectedAppsDescription', 'notifications'),
                type: 'success',
                icon: 'check',
                color: 'green',
                time: notifications.toastDuration
            });
        }
    });


    const onCopyToken = () => {
        if (appTokenQueryLoading || appTokenQueryError) {
            return;
        }
        if (appTokenQueryData?.appToken) {
            navigator.clipboard.writeText(appTokenQueryData.appToken);
        }
        if (!state.isTokenCopied) {
            setState({...state, isTokenCopied: !state.isTokenCopied});
            setTimeout(() => {
                setState({...state, isTokenCopied: false});
            }, 3000);
        }
    };

    const onRevivalToken = () => {
        setState({...state, isTokenHidden: !state.isTokenHidden});
    };

    const onRefreshToken = () => {
        refetchAppToken();
    };

    const onAppsLogOut = () => {
        onAppsLogOutConfirmToggle();
        appsLogout();
    };

    const onAppsLogOutConfirmToggle = () => {
        setState({...state, appsLogoutConfirmModalOpen: !state.appsLogoutConfirmModalOpen});
    };

    return (
        <Segment basic loading={appTokenQueryLoading || appTokenQueryError}>
            <Input actionPosition="left"
                   value={appTokenQueryData?.appToken || ''}
                   type={state.isTokenHidden ? 'password' : 'text'}
                   className={styles.input}
                   readOnly
                   action={
                       <Button color="teal"
                               labelPosition="left"
                               content={get('copy', 'settings')}
                               icon={state.isTokenCopied ? 'check' : 'copy'}
                               onClick={onCopyToken}
                       />
                   }
            />
            <Button.Group>
                <Button className={styles.revivalButton}
                        onClick={onRevivalToken}
                        icon={state.isTokenHidden ? 'eye' : 'eye slash'}
                        content={get(state.isTokenHidden ? 'revival' : 'hide', 'settings')}
                />
                <Button color="grey" icon="refresh"
                        content={get('refresh', 'settings')}
                        loading={appTokenQueryLoading}
                        onClick={onRefreshToken}
                />
                <Button inverted color="red" icon="plug"
                        content={get('logOut', 'settings')}
                        loading={appsLogoutLoading || appsLogoutError}
                        onClick={onAppsLogOutConfirmToggle}
                />
                <Confirm open={state.appsLogoutConfirmModalOpen}
                         header={get('logOutConfirmationHeader', 'settings')}
                         content={get('logOutConfirmationMessage', 'settings')}
                         onCancel={onAppsLogOutConfirmToggle}
                         onConfirm={onAppsLogOut}
                         className="modalContainer"
                         cancelButton={<Button basic content={get('cancel')}/>}
                         confirmButton={<Button basic negative content={get('confirmLogOut', 'settings')}/>}
                />
            </Button.Group>
        </Segment>
    );
};

export default ConnectedAppsSetting;
