import React from 'react';
import styles from './Header.module.css';
import {Button, Container, Grid} from 'semantic-ui-react';
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import {useMutation, useQuery, useSubscription} from '@apollo/client';
import userMutations from '../../../graphql/mutations/users';
import {withApollo} from '@apollo/client/react/hoc';
import {logout} from '../../../utils/Auth';
import Account from './Account/Account';
import userQueries from '../../../graphql/queries/users';
import settingQueries from '../../../graphql/queries/settings';
import notificationSubscriptions from '../../../graphql/subscriptions/notifications';
import notificationFragments from '../../../graphql/fragments/notifications';
import {pages, notifications} from '../../../config';
import {toFloat} from '../../../utils/GlobalUtils';
import {createEntityCache} from '../../../utils/CacheUtils';
import useSound from 'use-sound';
import {getSetting} from '../../../utils/SettingUtils';
import {get} from '../../../utils/TranslationUtils';
import newNotificationSound from '../../../sounds/new-notification.mp3';
import NotificationsList from './NotificationsList/NotificationsList';


const Header = ({client, onToggleMenu, onSectionClick}) => {
    const [play] = useSound(newNotificationSound, {
        volume: notifications.volume
    });

    const {data: userQueryData} = useQuery(userQueries.GET_USER_WITH_BALANCE);

    const {data: settingsQueryData} = useQuery(settingQueries.GET_SETTINGS);

    useSubscription(notificationSubscriptions.ON_NOTIFICATION_CREATED, {
        onSubscriptionData: ({client, subscriptionData}) => {
            const newNotification = subscriptionData.data.onNotificationCreated;
            createEntityCache(
                client.cache,
                newNotification,
                ['notifications'],
                notificationFragments.NEW_NOTIFICATION,
                {},
                true
            );
            client.cache.modify({
                fields: {
                    unreadNotificationsCount(currentValueRef) {
                        return currentValueRef + 1;
                    }
                }
            });

            if (getSetting('TurnNotificationsOn', settingsQueryData)) {
                if (getSetting('TurnNotificationsSoundOn', settingsQueryData)) {
                    play();
                }
                toast({
                    title: get('newNotificationTitle', 'notifications'),
                    description: newNotification.title,
                    type: 'info',
                    icon: 'envelope',
                    color: 'teal',
                    time: notifications.toastDuration
                });
            }
        },
        variables: {userId: userQueryData?.user?.id},
    });

    const [logoutFromServer, {loading}] = useMutation(userMutations.LOGOUT_USER);

    const onLogOut = () => logoutFromServer().then(() => logout(client));

    const displayUnreadNotifications = getSetting('TurnNotificationsOn', settingsQueryData);

    return (
        <nav className={styles.navbar + ' navbar navbar-dark'}>
            <div className="ml-3">
                <Button onClick={onToggleMenu} icon="ellipsis horizontal" size="large" inverted/>
                <span className={styles.logo + ' navbar-brand ml-3'} onClick={() => onSectionClick(pages.names.dashboard)}>
                    Cash Scheduler
                </span>
            </div>
            <div>
                <Grid columns={displayUnreadNotifications ? 4 : 3}>
                    <Grid.Column textAlign="center" verticalAlign="middle" width={5}>
                        {userQueryData?.user && getSetting('ShowBalance', settingsQueryData) &&
                            <Container className={styles.balanceContainer}
                                       onClick={() => onSectionClick(pages.names.transactions)}
                                       content={toFloat(userQueryData.balance)}
                            />
                        }
                    </Grid.Column>
                    {displayUnreadNotifications
                    && <Grid.Column textAlign="center" verticalAlign="middle" width={3}>
                        <NotificationsList/>
                    </Grid.Column>}
                    <Grid.Column textAlign="center" verticalAlign="middle" width={2}>
                        {userQueryData?.user && <Account user={userQueryData.user} balance={userQueryData.balance}/>}
                    </Grid.Column>
                    <Grid.Column textAlign="center" width={6}>
                        <Button inverted color="grey"
                                onClick={onLogOut}
                                loading={loading}
                                content={get('logOut', 'header')}
                        />
                    </Grid.Column>
                </Grid>
            </div>

            <SemanticToastContainer animation="bounce" className={styles.notificationsContainer}/>
        </nav>
    );
};

export default withApollo(Header);
