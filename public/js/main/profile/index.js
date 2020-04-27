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

// TODO: try to fix a bug when clicking on a page item at the left corner while the current view is loading
let currentView = 'categories';
const viewRenderHandlers = {
    dashboard: loadDashboardView,
    notifications: loadNotificationsView,
    income: loadIncomeView,
    expenses: loadExpensesView,
    categories: loadCategoriesView,
    settings: loadSettingsView
};

function loadPageContent() {
    loadDashboardView()
        .then(initNotificationListener)
        .then(initHandlers);
}


function loadDashboardView() {
    return loadTemplate('dashboard')
        .then(initCalendar);
}

function loadNotificationsView() {
    return loadTemplate('notifications')
        .then(initMessageList);
}

function loadIncomeView() {
    return loadTemplate('income');
}

function loadExpensesView() {
    return loadTemplate('expenses');
}

function loadCategoriesView() {
    return loadTemplate('categories')
        .then(initCategoriesList);
}

function loadSettingsView() {
    return loadTemplate('settings');
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

    menuItems.click(function () {
        menuItems.each(item => $(menuItems[item]).removeClass('active'));
        $(this).addClass('active');
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
