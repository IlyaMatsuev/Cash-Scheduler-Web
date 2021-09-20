import React, {useState} from 'react';
import {Button, Container, Form, Header, Segment} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import userMutations from '../../../../graphql/mutations/users';
import errorDefs from '../../../../utils/ErrorDefinitions';
import ErrorsList from '../../../../utils/ErrorsList';
import SecretField from '../../../../utils/SecretField';
import {onUIErrors} from '../../../../utils/GlobalUtils';


const ResetPasswordForm = ({email, code, goBackToLogin}) => {

    const initErrorsState = {email: '', password: '', confirmPassword: ''};
    const [errors, setErrors] = useState(initErrorsState);
    const [state, setState] = useState({
        email,
        code,
        password: '',
        confirmPassword: ''
    });

    const validate = () => {
        let noErrors = true;
        if (state.password !== state.confirmPassword) {
            setErrors({
                ...errors,
                password: errorDefs.PASSWORDS_DO_NOT_MATCH_ERROR,
                confirmPassword: errorDefs.PASSWORDS_DO_NOT_MATCH_ERROR
            });
            noErrors = false;
        }

        return noErrors;
    };

    const [resetPassword, {loading}] = useMutation(userMutations.RESET_PASSWORD, {
        update() {
            goBackToLogin(null, 100);
        },
        onError(error) {
            onUIErrors(error, setErrors, errors);
        },
        variables: state
    });

    const onSubmit = event => {
        event.preventDefault();
        setErrors(initErrorsState);
        if (validate()) {
            resetPassword();
        }
    };

    const onChange = event => {
        event.preventDefault();
        const {name, value} = event.target;
        setState({...state, [name]: value});
        setErrors({...errors, [name]: undefined});
    };

    const onBack = event => {
        goBackToLogin(event, 100);
    };

    return (
        <Container>
            <Form size="large" noValidate error onSubmit={onSubmit}>
                <Segment stacked>
                    <Header as="h1" color="violet" textAlign="center">
                        Reset Password
                    </Header>
                    <SecretField value={state.password} error={!!errors.password} onChange={onChange}/>
                    <Form.Input fluid icon="lock" iconPosition="left" placeholder="Confirm Password" type="password"
                                name="confirmPassword" value={state.confirmPassword} onChange={onChange} error={!!errors.confirmPassword}/>

                    <ErrorsList errors={errors}/>

                    <Button color="violet" fluid size="large" loading={loading}>
                        Reset
                    </Button>

                    <Button color="violet" inverted fluid className="mt-3" size="large" onClick={onBack}>
                        Back To Login
                    </Button>
                </Segment>
            </Form>
        </Container>
    );
};

export default ResetPasswordForm;
