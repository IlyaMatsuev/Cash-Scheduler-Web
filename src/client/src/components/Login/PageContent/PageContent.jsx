import React, {useState} from 'react';
import styles from './PageContent.module.css';
import {Grid} from 'semantic-ui-react';
import LoginForm from './LoginForm/LoginForm';
import {animated, useSpring} from 'react-spring';
import RegisterForm from './RegisterForm/RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm/ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm';


const formShownStyle = {
    opacity: 1,
    display: 'block'
};
const formHiddenStyle = {
    opacity: 0,
    display: 'none'
};

const PageContent = () => {

    const [state, setState] = useState({
        email: '',
        code: ''
    });

    const [loginFormAnimation, setLoginAnimation] = useSpring(() => ({transform: 'translate3d(0%,0,0)', ...formShownStyle}));
    const [registerFormAnimation, setRegisterAnimation] = useSpring(() => (formHiddenStyle));
    const [forgotPasswordFormAnimation, setForgotPasswordAnimation] = useSpring(() => ({transform: 'translate3d(50%,0,0)', ...formHiddenStyle}));
    const [resetPasswordFormAnimation, setResetPasswordAnimation] = useSpring(() => ({transform: 'translate3d(100%,0,0)', ...formHiddenStyle}));

    const fadeForm = (from, to) => {
        from(formHiddenStyle);
        to(formShownStyle);
    };

    const swapForm = (from, to, delta) => {
        from({
            to: async next => {
                await next({transform: `translate3d(${delta}%,0,0)`, opacity: 0, config: {duration: 200}});
                await next({display: 'none'});
                to({
                    transform: 'translate3d(0%,0,0)',
                    ...formShownStyle,
                    config: {duration: 200}
                });
            }
        });
    };

    const goToRegister = () => {
        fadeForm(setLoginAnimation, setRegisterAnimation);
    };

    const goToLogin = () => {
        fadeForm(setRegisterAnimation, setLoginAnimation);
    };

    const goToForgotPassword = event => {
        event.preventDefault();
        swapForm(setLoginAnimation, setForgotPasswordAnimation, -50);
    };

    const goBackToLogin = (event, delta) => {
        if (event) {
            event.preventDefault();
        }
        if (delta === 100) {
            swapForm(setResetPasswordAnimation, setLoginAnimation, delta);
        } else if (delta === 50) {
            swapForm(setForgotPasswordAnimation, setLoginAnimation, delta);
        }
    };

    const goToResetPassword = (email, code) => {
        setState({...state, email, code});
        swapForm(setForgotPasswordAnimation, setResetPasswordAnimation, -100);
    }

    return (
        <div className={styles.loginContentWrapper}>
            <Grid textAlign='center' className={styles.loginContentGrid} verticalAlign='middle'>
                <Grid.Column className={styles.loginContentColumn}>

                    <animated.div style={loginFormAnimation}>
                        <LoginForm goToRegister={goToRegister} goToRestorePassword={goToForgotPassword}/>
                    </animated.div>

                    <animated.div style={registerFormAnimation}>
                        <RegisterForm goToLogin={goToLogin}/>
                    </animated.div>

                    <animated.div style={forgotPasswordFormAnimation}>
                        <ForgotPasswordForm goToResetPassword={goToResetPassword} goBackToLogin={goBackToLogin}/>
                    </animated.div>

                    {
                        state.email && state.code && (
                            <animated.div style={resetPasswordFormAnimation}>
                                <ResetPasswordForm email={state.email} code={state.code} goBackToLogin={goBackToLogin}/>
                            </animated.div>
                        )
                    }

                </Grid.Column>
            </Grid>
        </div>
    )
}

export default PageContent;
