import React, {useState} from 'react';
import {Button, Container, Divider, Header, Icon, Label, Popup, Segment} from 'semantic-ui-react';
import styles from './NotificationsList.module.css';
import {useMutation, useQuery} from '@apollo/client';
import notificationQueries from '../../../../graphql/queries/notifications';
import notificationMutations from '../../../../graphql/mutations/notifications';
import notificationFragments from '../../../../graphql/fragments/notifications';
import NotificationReadModal from './NotificationReadModal/NotificationReadModal';
import {updateEntityCache} from '../../../../utils/CacheUtils';
import {get} from '../../../../utils/TranslationUtils';


const NotificationsList = () => {
    const initState = {
        selectedNotification: {},
        notificationsListOpen: false,
        notificationModalOpen: false
    };
    const [state, setState] = useState(initState);


    const {
        data: notifications,
        loading: notificationsLoading,
        error: notificationsError
    } = useQuery(notificationQueries.GET_NOTIFICATIONS);

    const [
        toggleReadNotification,
        {loading: toggleNotificationLoading}
    ] = useMutation(notificationMutations.TOGGLE_READ_NOTIFICATION, {
        update: (cache, result) => {
            if (result?.data) {
                const updatedNotification = result.data.toggleReadNotification;
                updateEntityCache(
                    cache,
                    updatedNotification,
                    notificationFragments.TOGGLE_NOTIFICATION,
                    {isRead: updatedNotification.isRead}
                );
                cache.modify({
                    fields: {
                        unreadNotificationsCount(currentValueRef) {
                            return currentValueRef + (updatedNotification.isRead ? -1 : 1);
                        }
                    }
                });
            }
        }
    });


    const toggleNotification = (id, read) => {
        toggleReadNotification({variables: {id, read}});
    };

    const onNotificationRead = selectedNotification => {
        if (!selectedNotification.isRead) {
            toggleNotification(selectedNotification.id, true);
        }
        setState({...state, notificationModalOpen: true, selectedNotification});
    };

    const onNotificationUnread = () => {
        toggleNotification(state.selectedNotification.id, false);
        onNotificationModalToggle();
    };

    const onNotificationsListToggle = () => {
        setState({...state, notificationsListOpen: !state.notificationsListOpen});
    };

    const onNotificationModalToggle = () => {
        setState({...state, notificationModalOpen: !state.notificationModalOpen});
    };

    const haveNotifications = () => {
        return notifications?.unreadNotificationsCount > 0;
    };

    return (
        <Popup open={state.notificationsListOpen} position="bottom left" flowing
               trigger={
                   <Label
                       className={styles.notificationsListPopup + (haveNotifications() ? '' : ` ${styles.noNotifications}`)}
                       onClick={onNotificationsListToggle}
                   >
                       <Icon name="mail"/>
                       {haveNotifications() ? notifications.unreadNotificationsCount : ''}
                   </Label>
               }
        >
            <Popup.Content>
                <Container fluid className={styles.notificationsListContainer}>
                    <Segment basic className="content scrolling" loading={notificationsLoading || !!notificationsError}>
                        <Header as="h3" textAlign="center" content={get('title', 'notifications')}/>
                        <Divider/>
                        {notifications && notifications.notifications.map(notification => (
                            <Segment key={notification.id} inverted={!notification.isRead}
                                     color="grey" textAlign="center"
                                     className={styles.notificationEntry}>
                                <Header as="div" size="small" onClick={() => onNotificationRead(notification)}
                                        className={styles.notificationTitle}>
                                    {notification.title}
                                </Header>
                                <Button inverted={!notification.isRead} size="tiny" loading={toggleNotificationLoading}
                                        icon={notification.isRead ? 'envelope open' : 'envelope'}
                                        onClick={() => toggleNotification(notification.id, !notification.isRead)}
                                />
                            </Segment>
                        ))}
                    </Segment>

                    <NotificationReadModal open={state.notificationModalOpen} notification={state.selectedNotification}
                                           onModalToggle={onNotificationModalToggle} onUnread={onNotificationUnread}/>
                </Container>
            </Popup.Content>
        </Popup>
    );
};

export default NotificationsList;
