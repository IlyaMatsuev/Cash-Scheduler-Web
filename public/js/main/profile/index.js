$(() => {
    checkPageAccess()
        .then(access => {
            if (access) {
                appearElementSlowly('body');
                applyViewSettings();
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


/*
* Handlers
*/

function onGlobalSearch() {
    // TODO: implement dropdown search by categories/transactions/notifications
    /*const searchTerm = $(this).val();
    const matchedTransactions = transactionList.transactions.filter(transaction => transaction.title.startsWith(searchTerm));
    const matchedNotifications = messagesList.notifications.filter(notification => notification.title.startsWith(searchTerm));
    const matchedCategories = categoriesList.categories.filter(category => category.name.startsWith(searchTerm));

    const matchedList = [];
    matchedList.push(...matchedTransactions, ...matchedNotifications, ...matchedCategories);
    console.log(matchedList);*/
}

function clickBalance() {
    const transactionsSectionButton = $('.nav > .nav-item > .nav-link[data-view="transactions"]');
    transactionsSectionButton.click();
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
    const balanceHeader = $('nav .user-balance');
    const searchHeader = $('nav .global-search');
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
    balanceHeader.click(clickBalance);
    searchHeader.on('input', onGlobalSearch);
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
