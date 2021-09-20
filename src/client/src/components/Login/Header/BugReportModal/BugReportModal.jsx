import React, {useState, createRef} from 'react';
import {Button, Container, Form, Modal} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import ReCAPTCHA from 'react-google-recaptcha';
import salesforceMutations from '../../../../graphql/mutations/salesforce';
import {onUIErrors} from '../../../../utils/GlobalUtils';
import {auth, recaptcha, notifications} from '../../../../config';
import styles from './BugReportModal.module.css';


const BugReportModal = ({open, onToggle}) => {
    const initState = {
        bugReport: {
            name: '',
            email: localStorage.getItem(auth.emailName) || '',
            phone: '',
            subject: '',
            description: ''
        },
        recaptchaChecked: false
    };
    const [state, setState] = useState(initState);
    const [errors, setErrors] = useState({});
    const recaptchaRef = createRef();


    const [reportBug, {loading: bugReportLoading}] = useMutation(salesforceMutations.REPORT_BUG, {
        onCompleted: () => {
            toast({
                title: 'New Question Is Sent!',
                description: 'Thanks for your question! We\'ll contact you though email or phone.',
                type: 'success',
                icon: 'check',
                color: 'green',
                time: notifications.toastDuration
            });
            onModalToggle();
        },
        onError: error => onUIErrors(error, setErrors, errors),
        variables: {
            bugReport: state.bugReport
        }
    });

    const getErrorOrNull = error => {
        return error
            ? {content: error, pointing: 'above'}
            : error;
    };

    const onModalToggle = () => {
        onToggle();
        if (recaptchaRef?.current) {
            recaptchaRef.current.reset();
        }
        setState(initState);
        setErrors({});
    };

    const onBugReportChange = (event, {name, value}) => {
        setState({...state, bugReport: {...state.bugReport, [name]: value}});
        setErrors({...errors, [name]: undefined});
    };

    const onRecaptchaCheck = code => {
        if (code) {
            setState({...state, recaptchaChecked: true});
        }
    };

    const onSave = () => {
        setErrors({});
        if (state.recaptchaChecked) {
            reportBug();
        }
    };

    return (
        <Container fluid>
            <Modal dimmer closeOnEscape
                   closeOnDimmerClick className="modalContainer"
                   open={open} onClose={onModalToggle}>
                <Modal.Header>
                    Ask Question / Bug Report
                </Modal.Header>
                <Modal.Content>
                    <Form loading={bugReportLoading}>
                        <Form.Group widths="equal">
                            <Form.Input name="name" label="Name" placeholder="John Wick"
                                        error={getErrorOrNull(errors.name)}
                                        value={state.bugReport.name} onChange={onBugReportChange}
                            />
                            <Form.Input name="email" label="Email" required
                                        type="email" placeholder="john.wick@example.com"
                                        error={getErrorOrNull(errors.email)}
                                        value={state.bugReport.email} onChange={onBugReportChange}
                            />
                            <Form.Input name="phone" label="Phone"
                                        type="text" placeholder="+375292033067"
                                        error={getErrorOrNull(errors.phone)}
                                        value={state.bugReport.phone} onChange={onBugReportChange}
                            />
                        </Form.Group>
                        <Form.Input name="subject" label="Subject" required
                                    type="text" placeholder="Some Topic..."
                                    error={getErrorOrNull(errors.subject)}
                                    value={state.bugReport.subject} onChange={onBugReportChange}
                        />
                        <Form.TextArea name="description" label="Description" required
                                       placeholder="Hi there! I've got a question about..."
                                       error={getErrorOrNull(errors.description)}
                                       value={state.bugReport.description} onChange={onBugReportChange}
                        />
                        <ReCAPTCHA ref={recaptchaRef} sitekey={recaptcha.siteKey} onChange={onRecaptchaCheck}/>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic onClick={onModalToggle}>
                        Close
                    </Button>
                    <Button primary disabled={!state.recaptchaChecked} onClick={onSave}>
                        Send
                    </Button>
                </Modal.Actions>
            </Modal>
            <SemanticToastContainer animation="bounce" className={styles.notificationsContainer}/>
        </Container>
    );
};

export default BugReportModal;
