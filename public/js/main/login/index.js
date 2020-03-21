const FORM_CONTAINER_CLASS = 'form-container';
const ACTIVE_FORM_CONTAINER_CLASS = 'active-form';
const NON_ACTIVE_FORM_CONTAINER_CLASS = 'non-active-form';
const FORGOT_FORM_CONTAINER_CLASS = 'forgot-form';
const FORGOT_FORM_HIDE_CLASS = 'forgot-form-hide';
const FORM_WRAPPER_CLASS = 'form-wrapper';
const FORM_BUTTON_CONTAINER_CLASS = 'form-submit-button';
let VerificationCodeSent = false;

$(() => {
    $(`.${ACTIVE_FORM_CONTAINER_CLASS} .${FORM_WRAPPER_CLASS} form :input`).bind('input', clearInputErrors);
    $(`.${NON_ACTIVE_FORM_CONTAINER_CLASS} .${FORM_WRAPPER_CLASS} form :input`).bind('input', clearInputErrors);

    $(`.${FORGOT_FORM_CONTAINER_CLASS} .${FORM_WRAPPER_CLASS} form :input`).bind('input', () => {
        clearInvalidEmailMessage(`.${FORGOT_FORM_CONTAINER_CLASS} .forgot-email-step-wrapper input`);
        clearInvalidEmailMessage(`.${FORGOT_FORM_CONTAINER_CLASS} .forgot-code-step-wrapper input`);
    });

    $(`.${FORM_BUTTON_CONTAINER_CLASS}.loadable button`).click(function () {
        $(this).addClass('loading');
    })
});


function switchForm() {
    const activeFormContainer = $(`.${FORM_CONTAINER_CLASS}.${ACTIVE_FORM_CONTAINER_CLASS}`);
    const nonActiveFormContainer = $(`.${FORM_CONTAINER_CLASS}.${NON_ACTIVE_FORM_CONTAINER_CLASS}`);

    const activeForm = $(`.${ACTIVE_FORM_CONTAINER_CLASS} form`);
    const nonActiveForm = $(`.${NON_ACTIVE_FORM_CONTAINER_CLASS} form`);

    let currentHeight = activeForm.prop('max-height') || '22rem';
    let futureHeight = nonActiveForm.prop('max-height') || '25rem';

    activeForm.css({
        opacity: 1,
        'max-height': futureHeight
    });
    nonActiveForm.css({
        opacity: 0,
        'max-height': currentHeight
    });

    activeForm.animate({
        opacity: 0,
        'max-height': currentHeight
    }, 300, () => {
        activeFormContainer.removeClass(ACTIVE_FORM_CONTAINER_CLASS);
        activeFormContainer.addClass(NON_ACTIVE_FORM_CONTAINER_CLASS);

        nonActiveFormContainer.removeClass(NON_ACTIVE_FORM_CONTAINER_CLASS);
        nonActiveFormContainer.addClass(ACTIVE_FORM_CONTAINER_CLASS);

        nonActiveForm.animate({
            opacity: 1,
            'max-height': futureHeight
        }, 300);
    });
}

function forgotPassword() {
    const activeFormContainer = $(`.${FORM_CONTAINER_CLASS}.${ACTIVE_FORM_CONTAINER_CLASS}`);
    const forgotFormContainer = $(`.${FORGOT_FORM_CONTAINER_CLASS}`);

    const activeForm = $(`.${ACTIVE_FORM_CONTAINER_CLASS} form`);
    const forgotForm = $(`.${FORGOT_FORM_CONTAINER_CLASS} form`);

    const activeFormHeight = activeForm.prop('max-height') || '25rem';
    const forgotFormHeight = '20rem';

    activeForm.css({
        opacity: 1,
        'max-height': activeFormHeight
    });
    forgotForm.css({
        opacity: 0,
        'max-height': forgotFormHeight
    });

    activeForm.animate({
        opacity: 0,
        'max-height': forgotFormHeight
    }, 300, () => {
        activeFormContainer.removeClass(ACTIVE_FORM_CONTAINER_CLASS);
        activeFormContainer.addClass(NON_ACTIVE_FORM_CONTAINER_CLASS);

        forgotFormContainer.removeClass(FORGOT_FORM_HIDE_CLASS);

        forgotForm.animate({
            opacity: 1
        }, 300);
    });
}

function goBack() {
    const emailStepButtonsContainer = $('.forgot-email-step-wrapper');
    const codeStepButtonContainer = $('.forgot-code-step-wrapper');
    const changePasswordStepButtonContainer = $('.forgot-change-password-step-wrapper');

    if (
        emailStepButtonsContainer.is(':animated')
        || codeStepButtonContainer.is(':animated')
        || changePasswordStepButtonContainer.is(':animated')
    ) {
        return;
    }

    if (VerificationCodeSent) {
        moveToEmailStep();
        VerificationCodeSent = false;
    } else {
        const forgotFormContainer = $(`.${FORGOT_FORM_CONTAINER_CLASS}`);
        const nonActiveFormContainer = $(`.${FORM_CONTAINER_CLASS}.${NON_ACTIVE_FORM_CONTAINER_CLASS}`).first();

        const forgotForm = $(`.${FORGOT_FORM_CONTAINER_CLASS} form`);
        const nonActiveForm = $(`.${NON_ACTIVE_FORM_CONTAINER_CLASS} form`).first();

        const nonActiveFormHeight = nonActiveForm.prop('max-height') || '22rem';
        const forgotFormHeight = '20rem';

        nonActiveForm.css({
            opacity: 0,
            'max-height': forgotFormHeight
        });
        forgotForm.css({
            opacity: 1,
            'max-height': forgotFormHeight
        });

        forgotForm.animate({
            opacity: 0
        }, 300, () => {

            nonActiveFormContainer.removeClass(NON_ACTIVE_FORM_CONTAINER_CLASS);
            nonActiveFormContainer.addClass(ACTIVE_FORM_CONTAINER_CLASS);
            forgotFormContainer.addClass(FORGOT_FORM_HIDE_CLASS);

            nonActiveForm.animate({
                opacity: 1,
                'max-height': nonActiveFormHeight
            }, 300);
        });
    }
}

function sendVerificationCode() {
    const EMAIL_INPUT_SELECTOR = `.${FORGOT_FORM_CONTAINER_CLASS} .forgot-email-step-wrapper input`;
    let credentials = getFieldsFromForm(`.${FORGOT_FORM_CONTAINER_CLASS} .form-wrapper form :input`);

    if (!validateEmail(EMAIL_INPUT_SELECTOR)) {
        return;
    }

    fetch('/auth/send-code', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(response => {
        if (response.status === 200) {
            VerificationCodeSent = true;
            moveToVerificationCodeStep();
        } else {
            showInvalidEmailMessage(EMAIL_INPUT_SELECTOR);
        }
    });
}

function compareVerificationCodes(button) {
    const credentials = getFieldsFromForm(`.${FORGOT_FORM_CONTAINER_CLASS} .form-wrapper form :input`);

    if (!credentials.code) {
        $(button).removeClass('loading');
        showInvalidEmailMessage(`.${FORGOT_FORM_CONTAINER_CLASS} .forgot-code-step-wrapper input`);
        return;
    }

    fetch('/auth/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(response => {
        $(button).removeClass('loading');
        if (response.status === 200) {
            moveToChangePasswordStep();
        } else {
            showInvalidEmailMessage(`.${FORGOT_FORM_CONTAINER_CLASS} .forgot-code-step-wrapper input`);
        }
    });
}

function changePassword(button) {
    const credentials = getFieldsFromForm(`.${FORGOT_FORM_CONTAINER_CLASS} .form-wrapper form :input`);

    if (!credentials.code) {
        $(button).removeClass('loading');
        showInvalidEmailMessage(`.${FORGOT_FORM_CONTAINER_CLASS} .forgot-change-password-step-wrapper input`);
        return;
    }

    fetch('/auth/change-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(response => {
        $(button).removeClass('loading');
        if (response.status === 200) {
            redirectToLoginPage();
        } else {
            showInvalidEmailMessage(`.${FORGOT_FORM_CONTAINER_CLASS} .forgot-change-password-step-wrapper input`);
        }
    });
}

function login(button) {
    let credentials = getFieldsFromForm(`.${ACTIVE_FORM_CONTAINER_CLASS} .${FORM_WRAPPER_CLASS} form :input`);

    requestTokens(credentials)
        .then(tokens => {
            $(button).removeClass('loading');
            return tokens;
        })
        .then(tokens => redirectToProfilePage(tokens.accessToken))
        .catch(error => {
            $(button).removeClass('loading');
            showInputErrors(error.message)
        });

    return false;
}

function register(button) {
    let credentials = getFieldsFromForm(`.${ACTIVE_FORM_CONTAINER_CLASS} .${FORM_WRAPPER_CLASS} form :input`);

    fetch('/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(response => response.json())
        .then(response => {
            if (response.errors) {
                $(button).removeClass('loading');
                showInputErrors(response.errors[0]);
            } else {
                requestTokens(credentials)
                    .then(tokens => {
                        $(button).removeClass('loading');
                        return tokens;
                    })
                    .then(tokens => redirectToProfilePage(tokens.accessToken))
                    .catch(error => {
                        $(button).removeClass('loading');
                        showInputErrors(error.message)
                    });
            }
        });
    return false;
}


function getFieldsFromForm(selector) {
    let credentials = {};
    $(selector).serializeArray().forEach(field => credentials[field.name] = field.value);
    return credentials;
}

function showInputErrors(message) {
    $('.active-form .login-errors span').text(message);
    $('.active-form .form-input').css({'border-color': '#EE3D48'});
    $('.active-form .form-input span').css({'border-color': '#EE3D48'});
}

function clearInputErrors() {
    $('.active-form .login-errors span').text('');
    $('.active-form .form-input').css({'border-color': 'transparent'});
    $('.active-form .form-input span').css({'border-color': '#827ffe'});
}

function moveToEmailStep() {
    const emailStepButtonsContainer = $('.forgot-email-step-wrapper');
    const codeStepButtonContainer = $('.forgot-code-step-wrapper');

    if (emailStepButtonsContainer.is(':animated') || codeStepButtonContainer.is(':animated')) {
        return;
    }

    emailStepButtonsContainer.css('visibility', 'visible');

    emailStepButtonsContainer.animate({
        opacity: 1,
        left: '0%'
    }, 500);
    codeStepButtonContainer.animate({
        left: '120%',
        opacity: 0
    }, 500, () => codeStepButtonContainer.css('visibility', 'hidden'));
}

function moveToVerificationCodeStep() {
    const emailStepButtonsContainer = $('.forgot-email-step-wrapper');
    const codeStepButtonContainer = $('.forgot-code-step-wrapper');

    if (emailStepButtonsContainer.is(':animated') || codeStepButtonContainer.is(':animated')) {
        return;
    }

    codeStepButtonContainer.css('visibility', 'visible');

    emailStepButtonsContainer.animate({
        opacity: 0,
        left: '-120%'
    }, 500);
    codeStepButtonContainer.animate({
        left: '0%',
        opacity: 1
    }, 500, () => emailStepButtonsContainer.css('visibility', 'hidden'));
}

// TODO: correct the case of animation when "go back" from the change password form
function moveToChangePasswordStep() {
    const emailStepButtonsContainer = $('.forgot-email-step-wrapper');
    const codeStepButtonContainer = $('.forgot-code-step-wrapper');
    const changePasswordStepButtonContainer = $('.forgot-change-password-step-wrapper');

    if (
        emailStepButtonsContainer.is(':animated')
        || codeStepButtonContainer.is(':animated')
        || changePasswordStepButtonContainer.is(':animated')
    ) {
        return;
    }

    changePasswordStepButtonContainer.css('visibility', 'visible');

    codeStepButtonContainer.animate({
        opacity: 0,
        left: '-120%'
    }, 500);
    changePasswordStepButtonContainer.animate({
        left: '0%',
        opacity: 1
    }, 500, () => codeStepButtonContainer.css('visibility', 'hidden'));
}

function validateEmail(selector) {
    const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;

    if (EMAIL_REGEX.test($(selector).first().val())) {
        clearInvalidEmailMessage(selector);
        return true;
    } else {
        showInvalidEmailMessage(selector);
        return false;
    }
}

function showInvalidEmailMessage(selector) {
    const emailField = $(selector).first();
    const emailFieldContainer = emailField.parent();
    const emailFieldBorder = emailField.next();

    emailFieldContainer.css({'border-color': '#EE3D48'});
    emailFieldBorder.css({'border-color': '#EE3D48'});
    emailField.focus();
}

function clearInvalidEmailMessage(selector) {
    const emailField = $(selector).first();
    const emailFieldContainer = emailField.parent();
    const emailFieldBorder = emailField.next();

    emailFieldContainer.css({'border-color': 'transparent'});
    emailFieldBorder.css({'border-color': '#827ffe'});
}
