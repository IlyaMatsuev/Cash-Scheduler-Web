class TransactionList {
    constructor(transactions) {
        this.transactionsContainer = $('.transactions-container');
        this.transactionsList = this.transactionsContainer.find('.transactions-list-wrapper .section');
        this.chartsSection = this.transactionsContainer.find('.charts-section');
        this.transactions = transactions;
        this.render();
    }

    render() {
        this.renderChartsSection();
        this.renderTransactionsList();
    }

    renderChartsSection() {
        if (this.transactions.length === 0) {
            return;
        }
        this.clearChartsSection();
        new Chart(
            $('.income-chart-wrapper > canvas'),
            this.getCategoriesChartOptions('Income', 'Income')
        );
        new Chart(
            $('.expenses-chart-wrapper > canvas'),
            this.getCategoriesChartOptions('Expense', 'Expenses')
        );
        new Chart(
            $('.transactions-compare-wrapper > canvas'),
            this.getCompareChartOptions('Income - Expenses')
        );
    }

    renderTransactionsList() {
        this.clearTransactionList();
        const transactionsByDate = this.sortTransactionsByDate();
        const transactionsDates = Object.keys(transactionsByDate).sort();
        if (transactionsDates.length > 0) {
            transactionsDates.forEach(date => {
                const momentDate = moment(date);
                let sectionItemsString = '';
                transactionsByDate[date].forEach(transaction => sectionItemsString += this.getSectionItemByTransaction(transaction));
                this.transactionsList.append(`
                    <div class="list-item">
                        <div class="header">
                            <div class="day">${momentDate.format('DD')}</div>
                            <div class="full-date">
                                <div class="week-day">${momentDate.format('dddd')}</div>
                                <div class="month-year">${momentDate.format('MMMM YYYY')}</div>
                            </div>
                            <div class="delta-summary">${this.getSummaryDeltaForTransactions(transactionsByDate[date])}</div>
                        </div>
                        ${sectionItemsString}
                    </div>
                `);
            });
        } else {
            this.transactionsList.append(this.getEmptySection());
        }
    }


    getCategoriesChartOptions(type, title) {
        return {
            type: 'doughnut',
            data: this.getCategoriesChartData(type),
            options: {
                title: {
                    text: title,
                    display: true,
                    fontSize: 22,
                    fontColor: 'rgba(0, 0, 0, .54)'
                },
                legend: {
                    display: false
                },
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        bottom: 20
                    }
                },
                maintainAspectRatio: false
            }
        };
    }

    getCompareChartOptions(title) {
        return {
            type: 'line',
            data: this.getCompareChartData(),
            options: {
                title: {
                    text: title,
                    display: true,
                    fontSize: 22,
                    fontColor: 'rgba(0, 0, 0, .54)'
                },
                legend: {
                    position: 'top'
                },
                maintainAspectRatio: false
            }
        }
    }

    getCategoriesChartData(type) {
        const records = this.transactions.filter(t => t.category.transaction_type_name === type);
        if (!records || records.length === 0) {
            return {};
        }
        let transactionsSumByCategories = [];
        records.reduce((transactionsByCategoriesTemp, transaction) => {
            if (transactionsByCategoriesTemp[transaction.category.name]) {
                transactionsByCategoriesTemp[transaction.category.name].amount += transaction.amount;
            } else {
                transactionsByCategoriesTemp[transaction.category.name] = {
                    category: {name: transaction.category.name},
                    amount: transaction.amount
                };
                transactionsSumByCategories.push(transactionsByCategoriesTemp[transaction.category.name]);
            }
            return transactionsByCategoriesTemp;
        }, {category: {name: records[0].category.name}, amount: records[0].amount});
        transactionsSumByCategories = transactionsSumByCategories.map(t => ({...t, amount: t.amount.toFixed(2)}))

        const labels = transactionsSumByCategories.map(t => t.category.name);
        const values = transactionsSumByCategories.map(t => t.amount);
        const backgroundColors = transactionsSumByCategories.map(() => {
            let greenBalance = Math.floor(Math.random() * 200);
            let redBalance = Math.floor(Math.random() * 100);
            let blueBalance = Math.floor(Math.random() * 200);

            if (type === 'Income') {
                blueBalance = 255;
            } else if (type === 'Expense') {
                redBalance = 255;
            }
            return `rgba(${redBalance}, ${greenBalance}, ${blueBalance}, 0.4)`;
        });
        const borderColors = backgroundColors.map(c => c.slice(0, c.indexOf(', 0.4)')) + ', 1)');
        return {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        };
    }

    getCompareChartData() {
        const transactionsByDate = this.sortTransactionsByDate();
        const transactionsDates = Object.keys(transactionsByDate).sort();
        const startRangeDate = transactionsDates[0];
        const endRangeDate = transactionsDates[transactionsDates.length - 1];
        for (let date = moment(startRangeDate); date.format('YYYY-MM-DD') !== endRangeDate; date.add(1, 'days')) {
            const formattedDate = date.format('YYYY-MM-DD');
            if (!transactionsByDate[formattedDate]) {
                transactionsByDate[formattedDate] = [];
            }
        }
        const labels = Object.keys(transactionsByDate).sort();

        const income = labels.map(date => transactionsByDate[date].reduce((a, b) => {
            if (b.category.transaction_type_name === 'Income') {
                return a + b.amount;
            } else {
                return a;
            }
        }, 0).toFixed(2));
        const expenses = labels.map(date => transactionsByDate[date].reduce((a, b) => {
            if (b.category.transaction_type_name === 'Expense') {
                return a + b.amount;
            } else {
                return a;
            }
        }, 0).toFixed(2));
        return {
            labels: labels,
            datasets: [{
                data: income,
                label: 'Income',
                borderColor: '#7eb3ff'
            }, {
                data: expenses,
                label: 'Expenses',
                borderColor: '#FF7272'
            }]
        };
    }

    getSummaryDeltaForTransactions(transactions) {
        return transactions.reduce((sum, transaction) => {
            const negativeDelta = (transaction.category.transaction_type_name === 'Expense');
            return sum + transaction.amount * (negativeDelta ? -1 : 1);
        }, 0).toFixed(2);
    }

    getSectionItemByTransaction(transaction) {
        let negativeDelta = (transaction.category.transaction_type_name === 'Expense');
        return `
            <div class="section-item">
                <div class="image">
                    <img src="${transaction.category.image_url}" alt="">
                </div>
                <div class="title"><span>${transaction.category.name} ${transaction.title ? ` (${transaction.title})` : ''}</span></div>
                <div class="delta ${negativeDelta ? 'expenses' : 'income'}">${transaction.amount * (negativeDelta ? -1 : 1)}</div>
            </div>
        `;
    }

    getEmptySection() {
        return `
            <div class="empty-list">
                <span>There are no transactions for the month</span>
            </div>
        `;
    }

    sortTransactionsByDate() {
        const transactionsByDate = {};
        this.transactions.forEach(transaction => {
            if (transactionsByDate[transaction.date]) {
                transactionsByDate[transaction.date].push(transaction);
            } else {
                transactionsByDate[transaction.date] = [transaction];
            }
        });
        return transactionsByDate;
    }

    clearChartsSection() {
        const compareChart = $('.transactions-compare-wrapper');
        const chartsWrappers = this.chartsSection.find('div');
        compareChart.empty();
        compareChart.append('<canvas></canvas>');
        chartsWrappers.empty();
        chartsWrappers.append('<canvas></canvas>');
    }

    clearTransactionList() {
        this.transactionsList.empty();
    }
}

let transactionPerMonth = [];
let transactionList;

async function initTransactionList(transactionsRange) {
    await setTransactionsPerMonth(transactionsRange.month(), transactionsRange.year());
    transactionList = new TransactionList(transactionPerMonth);
    bindTransactionListControls(transactionsRange);
}

function bindTransactionListControls(transactionsRange) {
    // TODO: open modal window for editing transaction when clicking on it in the list
    // TODO: create separated list for regular transactions
    setTransactionsListHeaderRanges(transactionsRange);
}

function selectTransactionsRange(event) {
    const currentRange = $(event).parent().data('range');
    const selectedRange = $(event).data('range');
    if (selectedRange === currentRange) {
        return;
    }
    fadeSpinnerIn()
        .then(() => initTransactionList(moment(selectedRange)))
        .then(fadeSpinnerOut);
}


async function setTransactionsPerMonth(month, year) {
    transactionPerMonth = await graphql(
        'getTransactionsByMonth',
        `query{getTransactionsByMonth(month: ${month}, year: ${year}){id, title, user {balance}, category {name, transaction_type_name, image_url}, amount, date}}`
    );
}

function setTransactionsListHeaderRanges(currentMonthRange) {
    const transactionsListHeader = $('.transactions-list-wrapper > .header');
    const nearlyMonthsNames = {};
    nearlyMonthsNames[moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD')] = 'Last Month';
    nearlyMonthsNames[moment().startOf('month').format('YYYY-MM-DD')] = 'This Month';
    nearlyMonthsNames[moment().add(1, 'months').startOf('month').format('YYYY-MM-DD')] = 'Next Month';

    const pastMonthRange = moment(currentMonthRange).subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
    const nextMonthRange = moment(currentMonthRange).add(1, 'months').startOf('month').format('YYYY-MM-DD');
    currentMonthRange = currentMonthRange.startOf('month').format('YYYY-MM-DD');

    transactionsListHeader.empty();

    transactionsListHeader.data('range', currentMonthRange);
    transactionsListHeader.append(`
        <div class="list-range-item" data-range="${pastMonthRange}" onclick="selectTransactionsRange(this)">
            <span>${nearlyMonthsNames[pastMonthRange] ? nearlyMonthsNames[pastMonthRange] : pastMonthRange}</span>
        </div>
        <div class="list-range-item active" data-range="${currentMonthRange}" onclick="selectTransactionsRange(this)">
            <span>${nearlyMonthsNames[currentMonthRange] ? nearlyMonthsNames[currentMonthRange] : currentMonthRange}</span>
        </div>
        <div class="list-range-item" data-range="${nextMonthRange}" onclick="selectTransactionsRange(this)">
            <span>${nearlyMonthsNames[nextMonthRange] ? nearlyMonthsNames[nextMonthRange] : nextMonthRange}</span>
        </div>
    `);
}
