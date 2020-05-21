class Calendar {

    constructor(transactions, recurringTransactions) {
        this.container = $('.calendar')[0];
        this.transactions = transactions;
        this.recurringTransactions = recurringTransactions;
        this.today();
    }

    render() {
        this.clearCalendar();
        this.calendar = $('<div class="calendar-view"></div>');
        $(this.container).append(this.calendar);

        const calendarTable = $('<table class="table table-bordered"></table>');
        const calendarTableBody = $('<tbody></tbody>');

        calendarTable.append(calendarTableBody);

        const todayDate = moment();
        const activeMonth = this.date.clone().month();
        let countingDate = this.date.clone().startOf('month').startOf('week');

        for (let week = 0; week < 6; week++) {
            let calendarRow = $('<tr class="calendar-month-row"></tr>');

            for (let day = 0; day < 7; day++) {
                const dailyIncome = this.getTransactionSumByDate('Income', countingDate.format('YYYY-MM-DD'));
                const dailyExpenses = this.getTransactionSumByDate('Expense', countingDate.format('YYYY-MM-DD'));

                const regularIncomeSum = this.getRecurringTransactionSumByDate('Income', countingDate.format('YYYY-MM-DD'));
                const regularExpensesSum = this.getRecurringTransactionSumByDate('Expense', countingDate.format('YYYY-MM-DD'));

                let calendarDay = $(
                    `<td>
                        <div class="day-entry-number">
                            ${countingDate.format('D')}
                        </div>
                        <div class="day-entry-details">
                            <div class="income">${dailyIncome ? dailyIncome.toFixed(2) : ''}</div>
                            <div class="expenses">${dailyExpenses ? dailyExpenses.toFixed(2) : ''}</div>
                        </div>
                        <div class="day-entry-details">
                            <div class="regular-income">${regularIncomeSum ? regularIncomeSum.toFixed(2) : ''}</div>
                            <div class="regular-expenses">${regularExpensesSum ? regularExpensesSum.toFixed(2) : ''}</div>
                        </div>
                    </td>`
                );

                if (activeMonth !== countingDate.month()) {
                    calendarDay.addClass('calendar-prior-months-date');
                }
                if (todayDate.isSame(countingDate, 'day')) {
                    calendarDay.addClass('calendar-today');
                }

                calendarRow.append(calendarDay);
                countingDate.add(1, 'day');
            }
            calendarTableBody.append(calendarRow);
        }

        this.calendar.append(calendarTable);
        this.changeTitleDate();
    }

    next(callback) {
        this.date.endOf('month').add(1, 'day');
        this.render();
        if (callback) {
            callback();
        }
    }

    prev(callback) {
        this.date.startOf('month').subtract(1, 'day');
        this.render();
        if (callback) {
            callback();
        }
    }

    today(callback) {
        if (this.date && this.date.isSame(moment(), 'month')) {
            if (callback) {
                callback();
            }
            return;
        }
        this.date = moment();
        this.render();
        if (callback) {
            callback();
        }
    }

    clearCalendar() {
        $('.calendar .calendar-view').remove();
    }

    changeTitleDate() {
        $('.calendar-current-date').html(this.date.format('MMMM, YYYY'));
    }

    getTransactionSumByDate(type, date) {
        return this.transactions
            .filter(t => t.category.transaction_type_name === type && t.date === date)
            .reduce((a, b) => a + b.amount, 0);
    }

    getRecurringTransactionSumByDate(type, date) {
        return this.recurringTransactions
            .filter(t => t.category.transaction_type_name === type && t.next_transaction_date === date)
            .reduce((a, b) => a + b.amount, 0);
    }
}

const SINGLE_TRANSACTION_TYPE = 'transaction';
const EDIT_SINGLE_TRANSACTION_TYPE = 'edit-transaction';
const RECURRING_TRANSACTION_TYPE = 'regular-transaction';
const EDIT_RECURRING_TRANSACTION_TYPE = 'edit-regular-transaction';
const DEFAULT_TRANSACTION_TYPE = 'Income';
const TRANSACTION_INTERVAL_OPTIONS = [
    {
        name: 'Day',
        value: 'day'
    },
    {
        name: 'Week',
        value: 'week'
    },
    {
        name: 'Month',
        value: 'month'
    },
    {
        name: 'Year',
        value: 'year'
    }
];
let modalFormToggle = false;
let calendar;
const transactions = [];
const recurringTransactions = [];

async function initCalendar() {
    await setAllTransactions();
    await setAllRecurringTransactions();
    calendar = new Calendar(transactions, recurringTransactions);
    bindCalendarControls();
}

function bindCalendarControls() {
    const transactionControls = $('[data-toggle="transaction"]');
    const calendarControls = $('[data-toggle="calendar"]');
    const calendarContainer = $(calendar.container);

    const disableCalendarControls = () => calendarControls.attr('disabled', true);
    const enableCalendarControls = () => calendarControls.attr('disabled', false);

    $(document).click(event => {
        const modalContainer = $('.new-transaction-modal');
        if (modalFormToggle && !modalContainer.is(event.target) && modalContainer.has(event.target).length === 0) {
            cancelTransactionModalForm();
        }
    });
    transactionControls.click(function () {
        showTransactionModalForm($(this).data('action'));
    });
    calendarControls.click(function () {
        disableCalendarControls();
        const action = $(this).data('action');
        if (action) {
            calendar[action](enableCalendarControls);
        }
    });
    calendarContainer.on('wheel', event => {
        disableCalendarControls();
        setTimeout(() => {
            if (event.originalEvent.deltaY < 0) {
                calendar.next(enableCalendarControls);
            } else {
                calendar.prev(enableCalendarControls);
            }
        }, 100);
    });
}


function showTransactionModalForm(transactionType, preloadData) {
    return loadTemplate(transactionType + '-form', document.body, false)
        .then(() => initTransactionFormHandlers(transactionType))
        .then(() => preloadData ? preloadData() : null)
        .then(() => $('.new-transaction-modal-container').fadeIn(300).promise())
        .then(() => modalFormToggle = !modalFormToggle);
}

function cancelTransactionModalForm() {
    const modalContainer = $('.new-transaction-modal-container');
    return modalContainer.fadeOut(300).promise()
        .then(() => modalContainer.remove())
        .then(() => modalFormToggle = !modalFormToggle);
}


function createTransaction(transactionType) {
    if (!validateTransactionForm()) {
        return;
    }

    const title = $('#new-transaction-title').val();
    const amount = $('#new-transaction-amount').val();
    const date = $('#new-transaction-date').val();
    const category = $('#new-transaction-category').val();
    const interval = $('#new-transaction-date-interval').val();

    let transactionSaved;
    if (transactionType === SINGLE_TRANSACTION_TYPE) {
        transactionSaved = createSingleTransaction(title, amount, date, category);
    } else if (transactionType === RECURRING_TRANSACTION_TYPE) {
        transactionSaved = createRecurringTransaction(title, amount, date, interval, category);
    }
    return transactionSaved.then(cancelTransactionModalForm)
        .then(() => calendar = new Calendar(transactions, recurringTransactions))
        .then(fadeSpinnerOut);
}

function createSingleTransaction(title, amount, date, category) {
    return fadeSpinnerIn().then(() => graphql(
        'createTransaction',
        `mutation{createTransaction(transaction:{title: "${title}", category_id: ${category}, amount: ${amount}, date: "${date}"}){id, title, category{name, transaction_type_name}, amount, date}}`
    )).then(newTransaction => transactions.push(newTransaction));
}

function createRecurringTransaction(title, amount, date, interval, category) {
    return fadeSpinnerIn().then(() => graphql(
        'createRegularTransaction',
        `mutation{createRegularTransaction(transaction:{title: "${title}", category_id: ${category}, amount: ${amount}, next_transaction_date: "${date}", interval: "${interval}"}){id, title, category{name, transaction_type_name}, amount, next_transaction_date, interval}}`
    )).then(newRecurringTransaction => recurringTransactions.push(newRecurringTransaction));
}

function updateTransaction(transactionType) {
    if (!validateTransactionForm()) {
        return;
    }

    const id = $('#new-transaction-id').val();
    const title = $('#new-transaction-title').val();
    const amount = $('#new-transaction-amount').val();
    const date = $('#new-transaction-date').val();

    let transactionSaved;
    if (transactionType === EDIT_SINGLE_TRANSACTION_TYPE) {
        transactionSaved = updateSingleTransaction(id, title, amount, date);
    } else if (transactionType === EDIT_RECURRING_TRANSACTION_TYPE) {
        transactionSaved = updateRecurringTransaction(id, title, amount);
    }
    return transactionSaved.then(cancelTransactionModalForm)
        .then(() => initTransactionList(moment()))
        .then(fadeSpinnerOut);
}

function updateSingleTransaction(id, title, amount, date) {
    return fadeSpinnerIn().then(() => graphql(
        'updateTransaction',
        `mutation{updateTransaction(id: ${id}, transaction:{title: "${title}", amount: ${amount}, date: "${date}"}){id, title, category{name, transaction_type_name}, amount, date}}`
    ));
}

function updateRecurringTransaction(id, title, amount) {
    return fadeSpinnerIn().then(() => graphql(
        'updateRegularTransaction',
        `mutation{updateRegularTransaction(id: ${id}, transaction:{title: "${title}", amount: ${amount}}){id, title, category{name, transaction_type_name}, amount, date}}`
    ));
}

function deleteTransaction(transactionType) {
    // TODO: implement approve form for deleting
    /*if (!validateTransactionForm()) {
        return;
    }*/

    const id = $('#new-transaction-id').val();

    let transactionDeleted;
    if (transactionType === EDIT_SINGLE_TRANSACTION_TYPE) {
        transactionDeleted = deleteSingleTransaction(id);
    } else if (transactionType === EDIT_RECURRING_TRANSACTION_TYPE) {
        transactionDeleted = deleteRecurringTransaction(id);
    }
    return transactionDeleted.then(cancelTransactionModalForm)
        .then(() => initTransactionList(moment()))
        .then(fadeSpinnerOut);
}

function deleteSingleTransaction(id) {
    return fadeSpinnerIn().then(() => graphql(
        'deleteTransaction',
        `mutation{deleteTransaction(id: ${id}){id}}`
    ));
}

function deleteRecurringTransaction(id) {
    return fadeSpinnerIn().then(() => graphql(
        'deleteRegularTransaction',
        `mutation{deleteRegularTransaction(id: ${id}){id}}`
    ));
}


async function initTransactionFormHandlers(transactionType) {
    const amountField = $('#new-transaction-amount');
    const dateField = $('#new-transaction-date');
    const categoryField = $('#new-transaction-category');
    const transactionIntervalField = $('#new-transaction-date-interval');
    const transactionTypesField = $('.transaction-types');
    const cancelButton = $('.modal-cancel-button button');
    const createButton = $('.modal-create-button button');
    const updateButton = $('.modal-update-button button');
    const deleteButton = $('.modal-delete-button button');

    if (transactionType === RECURRING_TRANSACTION_TYPE) {
        setRecurringTransactionIntervalOptions(transactionIntervalField);
    }
    await setTransactionTypes(transactionTypesField);
    setCategoriesByType(categoryField, DEFAULT_TRANSACTION_TYPE);
    const transactionTypesItems = $('.transaction-types .dropdown-item');

    amountField.keypress(function(event) {
        const possibleAmountValue = $(this).val() + String.fromCharCode(event.which);
        return !isNaN(Number(possibleAmountValue));
    });
    dateField.datepicker({
        format: 'yyyy-mm-dd',
        todayBtn: 'linked',
        autoclose: true
    }).datepicker('setDate', 'now');
    transactionTypesItems.click(function () {
        transactionTypesItems.removeClass('active');
        $(this).addClass('active');
        const selectedTransactionType = $(this).text();
        $('#new-transaction-type').text(selectedTransactionType);
        setCategoriesByType(categoryField, selectedTransactionType);
    });
    cancelButton.click(cancelTransactionModalForm);
    createButton.click(() => createTransaction(transactionType));
    updateButton.click(() => updateTransaction(transactionType));
    deleteButton.click(() => deleteTransaction(transactionType));
}

function validateTransactionForm() {
    const INVALID_INPUT_STYLE = 'is-invalid';
    const amountField = $('#new-transaction-amount');
    let valid = true;

    if (!amountField.val() || amountField.val() <= 0) {
        valid = false;
        amountField.addClass(INVALID_INPUT_STYLE);
    } else {
        amountField.removeClass(INVALID_INPUT_STYLE);
    }
    // TODO: implement better field validation just to be sure in data quality
    return valid;
}


function setCategoriesByType(categoryField, transactionType) {
    return graphql(
        'getAllCategories',
        `query{getAllCategories(transactionType: "${transactionType}"){id, name, image_url}}`
    ).then(categories => {
        categoryField.empty();
        categories.forEach(category => categoryField.append($(`<option value="${category.id}">${category.name}</option>`)));
    });
}

function setTransactionTypes(transactionTypesField) {
    return graphql(
        'getTransactionTypes',
        'query{getTransactionTypes{type_name, image_url}}'
    ).then(transactionTypes => {
        transactionTypes.forEach(type => {
            const typeItem = $(`<a class="dropdown-item" href="javascript:void(0)" data-type="${type.type_name}">${type.type_name}</a>`);
            if (type.type_name === DEFAULT_TRANSACTION_TYPE) {
                typeItem.addClass('active');
            }
            transactionTypesField.append(typeItem);
        });
    });
}

function setRecurringTransactionIntervalOptions(intervalField) {
    TRANSACTION_INTERVAL_OPTIONS.forEach(interval => {
        intervalField.append($(`<option value="${interval.value}">${interval.name}</option>`));
    });
}

async function setAllTransactions() {
    if (!transactions || transactions.length === 0) {
        // TODO: consider is it's ok to fetch all records from db??
        // maybe fetch the only values for the current view
        transactions.push(...await graphql(
            'getAllTransactions',
            'query{getAllTransactions{id, title, category{name, transaction_type_name}, amount, date}}'
        ));
    }
}

async function setAllRecurringTransactions() {
    if (!recurringTransactions || recurringTransactions.length === 0) {
        // TODO: consider is it's ok to fetch all records from db??
        // maybe fetch the only values for the current view
        recurringTransactions.push(...await graphql(
            'getAllRegularTransactions',
            'query{getAllRegularTransactions{id, title, category{name, transaction_type_name}, amount, date, next_transaction_date, interval}}'
        ));
    }
}
