import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {Form, Button, Container, Segment, Header, Message} from 'semantic-ui-react';
import ErrorsList from '../../../../utils/ErrorsList';
import errorDefs from '../../../../utils/ErrorDefinitions';
import {isValidNumber, onUIErrors, toFloat, useLogin} from '../../../../utils/GlobalUtils';
import SecretField from '../../../../utils/SecretField';
import userMutations from '../../../../graphql/mutations/users';
import UserPolicyAgreementCheckbox from './UserPolicyAgreement/UserPolicyAgreementCheckbox';


const RegisterForm = ({goToLogin}) => {

    const initErrorsState = {email: '', password: '', confirmPassword: ''};
    const [errors, setErrors] = useState(initErrorsState);
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        balance: 0,
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
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

    const onError = error => onUIErrors(error, setErrors, errors)

    const [login, {loading: loginLoading}] = useLogin({email: state.email, password: state.password}, onError);

    const [register, {loading: registerLoading}] = useMutation(userMutations.REGISTER_USER, {
        update() {
            login();
        },
        onError,
        variables: {
            firstName: state.firstName,
            lastName: state.lastName,
            balance: toFloat(state.balance),
            email: state.email,
            password: state.password
        }
    });

    const onSubmit = event => {
        event.preventDefault();
        setErrors(initErrorsState);
        if (validate()) {
            register();
        }
    };

    const onChange = (event, {name, value, checked, type}) => {
        if (type === 'number' && !isValidNumber(value)) {
            return;
        }
        if (type === 'checkbox') {
            setState({...state, [name]: checked});
        } else {
            setState({...state, [name]: value});
        }
        setErrors({...errors, [name]: undefined});
    };

    return (
        <Container>
            <Form size="large" noValidate error onSubmit={onSubmit}>
                <Segment stacked>
                    <Header as="h1" color="violet" textAlign="center">
                        Sign Up
                    </Header>
                    <Form.Input fluid icon="user" iconPosition="left" placeholder="First Name" type="text"
                                name="firstName" value={state.firstName} error={!!errors.lastName} onChange={onChange}/>
                    <Form.Input fluid icon="user" iconPosition="left" placeholder="Last Name" type="text"
                                name="lastName" value={state.lastName} error={!!errors.lastName} onChange={onChange}/>
                    <Form.Input fluid icon="dollar" iconPosition="left" placeholder="Current Balance" type="number"
                                name="balance" value={toFloat(state.balance)} error={!!errors.balance} onChange={onChange}/>

                    <Form.Input fluid icon="mail" iconPosition="left" placeholder="Email" type="email"
                                name="email" value={state.email} error={!!errors.email} onChange={onChange}/>
                    <SecretField value={state.password} error={!!errors.password} onChange={onChange}/>
                    <Form.Input fluid icon="lock" iconPosition="left" placeholder="Confirm Password" type="password"
                                name="confirmPassword" value={state.confirmPassword} error={!!errors.confirmPassword}
                                onChange={onChange}/>

                    <UserPolicyAgreementCheckbox agree={state.agreement} onChange={onChange}/>

                    <ErrorsList errors={errors}/>

                    <Button color="violet" fluid size="large"
                            loading={registerLoading || loginLoading}
                            disabled={!state.agreement}
                            content="Register"
                    />
                </Segment>
            </Form>
            <Message>
                Already registered? <Button color="violet" inverted className="compact ml-2" onClick={goToLogin}>Sign In</Button>
            </Message>
        </Container>
    );
};


export default RegisterForm;
