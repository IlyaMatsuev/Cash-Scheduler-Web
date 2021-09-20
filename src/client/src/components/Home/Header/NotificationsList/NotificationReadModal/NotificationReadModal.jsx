import React from 'react';
import {Button, Container, Header, Modal} from 'semantic-ui-react';


const NotificationReadModal = ({open, notification, onModalToggle, onUnread}) => {
    return (
        <Modal open={open} dimmer size="small" closeOnEscape closeOnDimmerClick onClose={onModalToggle} className="modalContainer">
            <Modal.Header>
                <Header as="h2" textAlign="center">{notification.title}</Header>
            </Modal.Header>
            <Modal.Content scrolling>
                <Container fluid textAlign="center">
                    <div dangerouslySetInnerHTML={{__html: notification.content}}/>
                </Container>
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={onModalToggle}>
                    Cancel
                </Button>
                <Button basic color="teal" onClick={onUnread}>
                    Mark as unread
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default NotificationReadModal;
