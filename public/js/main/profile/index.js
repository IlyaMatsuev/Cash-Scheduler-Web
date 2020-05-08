$(() => {
    checkPageAccess()
        .then(access => {
            if (access) {
                appearBodySlowly();
                loadPageContent();
            }
        });
});

/*
* Page/view loading functionality
*/

let currentView = 'dashboard';
const viewRenderHandlers = {
    dashboard: loadDashboardView,
    notifications: loadNotificationsView,
    transactions: loadTransactionView,
    categories: loadCategoriesView,
    settings: loadSettingsView
};

function loadPageContent() {
    viewRenderHandlers[currentView]()
        .then(initNotificationListener);
    initHandlers();
}


function loadDashboardView() {
    return loadTemplate('dashboard')
        .then(initCalendar);
}

function loadNotificationsView() {
    return loadTemplate('notifications')
        .then(initMessageList);
}

function loadTransactionView() {
    return loadTemplate('transactions')
        .then(() => initTransactionList(moment()));
}

function loadCategoriesView() {
    return loadTemplate('categories')
        .then(initCategoriesList);
}

function loadSettingsView() {
    return loadTemplate('settings')
        .then(initSettingList);
}


function scrollToNewView(template) {
    let margin;
    const mainContainer = $('main');
    const currentViewIndex = Object.keys(viewRenderHandlers).findIndex(field => field === currentView);
    const newViewIndex = Object.keys(viewRenderHandlers).findIndex(field => field === template);
    if (newViewIndex > currentViewIndex) {
        margin = '-=60%';
    } else {
        margin = '+=60%';
    }
    return mainContainer.animate({'margin-top': margin}).promise()
        .then(fadeSpinnerIn)
        .then(fadeMainContainerOut)
        .then(() => mainContainer.css('margin-top', 0));
}

/*
* Handlers
*/

function signOut() {
    fetch('/auth/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            accessToken: window.localStorage.getItem('accessToken')
        })
    }).then(async response => {
        if (response.status === 400) {
            console.log(await response.json());
        } else {
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('refreshToken');
            window.location.href = '/';
        }
    });
}

/*
* Helpers
*/

function initHandlers() {
    const menuItems = $('.sidebar .nav-link');
    let pageLoadingProcessing = false;

    menuItems.click(function () {
        const template = $(this).data('view');
        if (currentView === template || pageLoadingProcessing) {
            return;
        }
        pageLoadingProcessing = true;
        menuItems.removeClass('active');
        $(this).addClass('active');

        scrollToNewView(template)
            .then(viewRenderHandlers[template])
            .then(fadeSpinnerOut)
            .then(fadeMainContainerIn)
            .then(() => currentView = template)
            .then(() => pageLoadingProcessing = false);
    });
}

function fadeSpinnerIn() {
    return $('.render-spinner').show().promise();
}

function fadeSpinnerOut() {
    return $('.render-spinner').hide().promise();
}

function fadeMainContainerIn() {
    return $('main').fadeIn().promise();
}

function fadeMainContainerOut() {
    return $('main').fadeOut().promise();
}
