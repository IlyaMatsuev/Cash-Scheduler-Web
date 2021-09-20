import React, {useState} from 'react';
import {Button, Container, Form, Header, Segment} from 'semantic-ui-react';
import {useLazyQuery} from '@apollo/client';
import {useSpring, animated} from 'react-spring';
import ErrorsList from '../../../../utils/ErrorsList';
import {onUIErrors} from '../../../../utils/GlobalUtils';
import userQueries from '../../../../graphql/queries/users';


const ForgotPasswordForm = ({goToResetPassword, goBackToLogin}) => {

    const initErrorsState = {email: ''};
    const [errors, setErrors] = useState(initErrorsState);
    const [state, setState] = useState({
        email: '',
        code: '',
        emailSent: false
    });

    const [codeFieldAnimation, setCodeFieldAnimation] = useSpring(() => ({opacity: 0, height: '0rem', display: 'none'}));

    const onError = error => onUIErrors(error, setErrors, errors);

    const [checkEmail, {loading: checkEmailLoading}] = useLazyQuery(userQueries.CHECK_EMAIL, {
        onCompleted(data) {
            setState({...state, email: data.checkEmail, emailSent: true});
            setCodeFieldAnimation({
                to: async next => {
                    await next({display: 'block'});
                    await next({height: '3rem', config: {duration: 150}});
                    await next({opacity: 1, config: {duration: 200}});
                }
            });
        },
        onError
    });
    const [checkCode, {loading: codeVerifyingLoading}] = useLazyQuery(userQueries.CHECK_CODE, {
        onCompleted(data) {
            goToResetPassword(data.checkCode, state.code);
        },
        onError
    });

    const onSubmit = event => {
        event.preventDefault();
        setErrors(initErrorsState);
        if (state.emailSent) {
            checkCode({variables: state});
        } else {
            checkEmail({variables: state});
        }
    };

    const onChange = event => {
        const {name, value} = event.target;
        setState({...state, [name]: value});
        setErrors({...errors, [name]: undefined});
    };

    const onBack = event => {
        goBackToLogin(event, 50);
    };


    return (
        <Container>
            <Form size="large" noValidate error onSubmit={onSubmit}>
                <Segment stacked>
                    <Header as="h1" color="violet" textAlign="center">
                        Restore Password
                    </Header>
                    <Form.Input fluid icon="mail" iconPosition="left" placeholder="Email" type="email"
                                name="email" value={state.email} error={!!errors.email} disabled={state.emailSent}
                                onChange={onChange}/>

                    <animated.div style={codeFieldAnimation}>
                        <Form.Input fluid icon="key" iconPosition="left" placeholder="Verification Code" type="text"
                                    name="code" value={state.code} error={!!errors.code} onChange={onChange}/>
                    </animated.div>

                    <ErrorsList errors={errors}/>

                    <Button color="violet" fluid className="mt-3" size="large" loading={checkEmailLoading || codeVerifyingLoading}>
                        {state.emailSent ? 'Reset Password' : 'Send Code'}
                    </Button>

                    <Button color="violet" inverted fluid className="mt-3" size="large" onClick={onBack}>
                        Go Back
                    </Button>
                </Segment>
            </Form>
        </Container>
    );
};

export default ForgotPasswordForm;
