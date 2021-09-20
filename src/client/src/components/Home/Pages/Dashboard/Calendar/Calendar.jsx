import React from 'react';
import {Grid, Container} from 'semantic-ui-react';
import moment from 'moment';
import styles from './Calendar.module.css';
import {toFloat} from '../../../../../utils/GlobalUtils';


const DISPLAY_WEEKS = 6;
const DISPLAY_DAYS = 7;

const getSummaryByDate = (transactions, date, type, key = 'date') => {
    const summary = transactions
        .filter(t => t.category.type.name === type && t[key] === date)
        .reduce((a, b) => a + b.amount, 0);
    return summary > 0 ? toFloat(summary) : null;
};

const getCalendarDays = (targetDate, startDate, transactions, recurringTransactions) => {
    const todayDate = moment();
    let currentDate = startDate.clone();
    const days = [];
    for (let i = 0; i < DISPLAY_WEEKS * DISPLAY_DAYS; i++) {
        const day = {
            key: i,
            date: currentDate.clone(),
            isToday: todayDate.isSame(currentDate, 'day'),
            incomeSummary: getSummaryByDate(transactions, currentDate.format('YYYY-MM-DD'), 'Income'),
            expenseSummary: getSummaryByDate(transactions, currentDate.format('YYYY-MM-DD'), 'Expense'),
            recurringIncomeSummary: getSummaryByDate(
                recurringTransactions,
                currentDate.format('YYYY-MM-DD'),
                'Income',
                'nextTransactionDate'
            ),
            recurringExpenseSummary: getSummaryByDate(
                recurringTransactions,
                currentDate.format('YYYY-MM-DD'),
                'Expense',
                'nextTransactionDate'
            )
        };
        if (day.isToday) {
            day.className = 'today';
        } else if (targetDate.isSame(currentDate, 'month')) {
            day.className = 'currentMonthDay';
        } else {
            day.className = 'otherMonthDay';
        }
        days.push(day);
        currentDate.add(1, 'day');
    }
    return days;
};

const Calendar = ({targetDate, transactions, recurringTransactions}) => {
    const startDate = targetDate.clone().startOf('month').startOf('week');
    return (
        <Grid className="fullHeight" columns={DISPLAY_DAYS} padded>
            {getCalendarDays(targetDate, startDate, transactions, recurringTransactions).map(day => (
                <Grid.Column key={day.key} className={styles[day.className]}>
                    <Container textAlign="left">
                        <h4>{day.date.format('D')}</h4>
                    </Container>
                    <Grid columns={2} padded>
                        <Grid.Row className={styles.commonTransactionsRow}>
                            <Grid.Column className={styles.incomeSummary}>{day.incomeSummary}</Grid.Column>
                            <Grid.Column className={styles.expenseSummary}>{day.expenseSummary}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row className={styles.recurringTransactionsRow}>
                            <Grid.Column
                                className={styles.recurringIncomeSummary}>{day.recurringIncomeSummary}</Grid.Column>
                            <Grid.Column
                                className={styles.recurringExpenseSummary}>{day.recurringExpenseSummary}</Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            ))}
        </Grid>
    );
};

export default Calendar;
