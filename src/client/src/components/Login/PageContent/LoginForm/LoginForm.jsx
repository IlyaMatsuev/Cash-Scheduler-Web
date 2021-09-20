import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import {Button, Container, Form, Grid, Header, Icon, Message, Segment} from 'semantic-ui-react';
import salesforceQueries from '../../../../graphql/queries/salesforce';
import ErrorsList from '../../../../utils/ErrorsList';
import {useLogin} from '../../../../utils/GlobalUtils';
import SecretField from '../../../../utils/SecretField';
import {onUIErrors} from '../../../../utils/GlobalUtils';


const LoginForm = ({goToRegister, goToRestorePassword}) => {

    const initErrorsState = {email: '', password: ''};
    const [errors, setErrors] = useState(initErrorsState);
    const [state, setState] = useState({
        email: '',
        password: '',
        remember: false,
        passwordShown: false
    });

    const {
        data: salesforceQueryData,
        loading: salesforceQueryLoading,
        error: salesforceQueryError
    } = useQuery(salesforceQueries.GET_SF_ENDPOINT);

    const [login, {loading}] = useLogin(state, error => onUIErrors(error, setErrors, errors));

    const onSubmit = event => {
        event.preventDefault();
        setErrors(initErrorsState);
        login();
    };

    const onChange = (event, data) => {
        const {name, value, checked} = data;
        if (data.type === 'checkbox') {
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
                        Sign In
                    </Header>
                    <Form.Input fluid icon="mail" iconPosition="left" placeholder="Email" type="email"
                                name="email" value={state.email} error={!!errors.email} onChange={onChange}/>
                    <SecretField value={state.password} error={!!errors.password} onChange={onChange}/>
                    <Grid padded="vertically">
                        <Grid.Column width={7}>
                            <Form.Checkbox label="Remember" type="checkbox" className="mt-2" name="remember"
                                           checked={state.remember} onChange={onChange}/>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Button color="purple" basic className="compact" onClick={goToRestorePassword} animated>
                                <Button.Content visible>Forgot?</Button.Content>
                                <Button.Content hidden>
                                    Reset <Icon name="arrow right"/>
                                </Button.Content>
                            </Button>
                        </Grid.Column>
                    </Grid>

                    <ErrorsList errors={errors}/>

                    <Button color="violet" fluid size="large" loading={loading}>
                        Login
                    </Button>
                </Segment>
            </Form>
            <Message>
                New to us?
                <Button color="violet" inverted className="compact ml-2" onClick={goToRegister}>
                    Sign Up
                </Button>
            </Message>
            <Message>
                Employee?
                <Button as="a" color="teal" className="compact ml-2"
                        href={salesforceQueryData?.salesforceApiEndpoint}
                        loading={salesforceQueryLoading || !!salesforceQueryError}
                >
                    Sign In Here
                </Button>
            </Message>
        </Container>
    );
};

export default LoginForm;