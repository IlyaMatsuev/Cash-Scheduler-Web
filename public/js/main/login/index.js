$(() => {
    $('.form-wrapper form :input').bind('input', clearInputErrors);
});

function switchForm() {
    const FORM_CONTAINER_CLASS = 'form-container';
    const ACTIVE_FORM_CONTAINER_CLASS = 'active-form';
    const NON_ACTIVE_FORM_CONTAINER_CLASS = 'non-active-form';

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

function login() {
    let credentials = {};
    const fields = $(".active-form .form-wrapper form :input");
    fields.serializeArray().forEach(field => credentials[field.name] = field.value);

    requestTokens(credentials)
        .then(tokens => redirectToProfilePage(tokens.accessToken))
        .catch(error => showInputErrors(error.message));

    return false;
}

function register() {
    let credentials = {};
    const fields = $(".active-form .form-wrapper form :input");
    fields.serializeArray().forEach(field => credentials[field.name] = field.value);

    fetch('/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(response => response.json())
        .then(response => {
            if (response.errors) {
                showInputErrors(response.errors[0]);
            } else {
                requestTokens(credentials)
                    .then(tokens => redirectToProfilePage(tokens.accessToken))
                    .catch(error => showInputErrors(error.message));
            }
        });
    return false;
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
