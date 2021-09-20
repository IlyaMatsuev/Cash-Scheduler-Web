import React, {useState} from 'react';
import moment from 'moment';
import {Button, Container, Divider, Grid, Segment, Header, Item, Placeholder} from 'semantic-ui-react';
import styles from './TransactionList.module.css';
import {convertToValidIconUrl} from '../../../../../utils/GlobalUtils';
import {get} from '../../../../../utils/TranslationUtils';
import NewTransactionModal from '../NewTransactionModal/NewTransactionModal';


const TransactionList = ({
                             transactions = [],
                             recurringTransactions = [],
                             transactionsLoading,
                             transactionsErrors,
                             date,
                             onPrevMonth,
                             onNextMonth,
                             onTransactionSelected,
                             isRecurring,
                             onTransactionsViewChange
}) => {
    const initState = {
        newTransactionModalOpen: false
    };
    const [state, setState] = useState(initState);


    const getTransactionsDaySummary = transactions => {
        return transactions.reduce((a, b) => {
            let delta = 0;
            if (b.category.type.name === 'Income') {
                delta = a + b.amount;
            } else if (b.category.type.name === 'Expense') {
                delta = a - b.amount;
            }
            return delta;
        }, 0).toFixed(2);
    };

    const sortTransactionsByDate = (transactions, dateField) => {
        const transactionsByDate = {};
        if (transactions) {
            transactions.forEach(transaction => {
                if (transactionsByDate[transaction[dateField]]) {
                    transactionsByDate[transaction[dateField]].push(transaction);
                } else {
                    transactionsByDate[transaction[dateField]] = [transaction];
                }
            });
        }
        return transactionsByDate;
    };

    const getCurrentDate = () => {
        const currentDate = moment(date);
        return get(currentDate.format('MMMM'), 'months') + ', ' + currentDate.year();
    };

    const getTransactionGroupDate = date => {
        return date.date() + ', ' + get(date.format('dddd'), 'weekDays');
    };

    const getNewTransactionButtonHeader = () => {
        const label = `new${isRecurring ? 'Recurring' : ''}Transaction`;
        return get(label, 'transactions');
    };

    const getTransactionGroupByDay = (transactions, date) =>{
        const momentDate = moment(date);

        const daySummary = getTransactionsDaySummary(transactions);
        const summaryColor = daySummary > 0 ? 'green' : 'red';

        return (
            <Container fluid key={date}>
                <Header attached="top">
                    {getTransactionGroupDate(momentDate)}
                    <Header as="h3" color={summaryColor} floated="right">{daySummary}</Header>
                </Header>
                <Segment attached>
                    <Item.Group>
                        {transactions.map(t => {
                            const isIncome = t.category.type.name === 'Income';
                            return (
                                <Item key={t.id} onClick={() => onTransactionSelected(t)} className={styles.transactionEntry}>
                                    <Item.Image size="tiny" src={convertToValidIconUrl(t.category.iconUrl)}/>
                                    <Item.Content>
                                        <Item.Header>{t.title ? t.title : t.category.name}</Item.Header>
                                        <Item.Meta>{t.category.name}</Item.Meta>
                                    </Item.Content>
                                    <Item.Extra>
                                        <Header as="h4" color={isIncome ? 'green' : 'red'} floated='right'>
                                            {isIncome ? '+' : '-'}{t.amount}
                                        </Header>
                                    </Item.Extra>
                                </Item>
                            );
                        })}
                    </Item.Group>
                </Segment>
            </Container>
        );
    };

    const getEmptyMonthMessage = () => {
        return (
            <Placeholder key={0} fluid>
                <Header textAlign="center" className="mt-3"
                        content={get('noRecordsMessage', 'transactions')}
                />
                {Array(30).fill(0).map((_, i) => <Placeholder.Line key={i}/>)}
            </Placeholder>
        );
    };

    const getTransactionsGroups = (transactions, dateField = 'date') => {
        const transactionsByDate = sortTransactionsByDate(transactions, dateField);
        const dates = Object.keys(transactionsByDate).sort();
        const groups = [];
        if (dates.length > 0) {
            groups.push(...dates.map(date => getTransactionGroupByDay(transactionsByDate[date], date)));
        } else {
            groups.push(getEmptyMonthMessage());
        }
        return groups;
    };

    const onNewTransactionModalToggle = () => {
        setState({...state, newTransactionModalOpen: !state.newTransactionModalOpen});
    };


    return (
        <Container fluid className="fullHeight">
            <Segment loading={transactionsLoading || transactionsErrors} className="fullHeight">
                <Grid padded centered columns={3}>
                    <Grid.Column width={3} textAlign="center">
                        <Button primary circular icon="chevron circle left" size="big" onClick={onPrevMonth}/>
                    </Grid.Column>
                    <Grid.Column width={10} textAlign="center">
                        <Header>{getCurrentDate()}</Header>
                        <Button.Group>
                            <Button color="blue" disabled={!isRecurring}
                                    onClick={onTransactionsViewChange}
                                    content={get('transactionsList', 'transactions')}
                            />
                            <Button.Or/>
                            <Button color="teal" disabled={isRecurring}
                                    onClick={onTransactionsViewChange}
                                    content={get('recurringTransactionsList', 'transactions')}
                            />
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center">
                        <Button primary circular icon="chevron circle right" size="big" onClick={onNextMonth}/>
                    </Grid.Column>
                </Grid>
                <Container fluid className={styles.newTransactionButtonContainer}>
                    <Button fluid primary
                            onClick={onNewTransactionModalToggle}
                            content={getNewTransactionButtonHeader()}
                    />
                </Container>
                <Divider/>
                <Container fluid className={styles.transactionsListContainer + ' pt-1'}>
                    {isRecurring && getTransactionsGroups(recurringTransactions, 'nextTransactionDate')}
                    {!isRecurring && getTransactionsGroups(transactions)}
                </Container>
            </Segment>

            <NewTransactionModal open={state.newTransactionModalOpen}
                                 onModalToggle={onNewTransactionModalToggle}
                                 isRecurring={isRecurring}
            />
        </Container>
    );
};

export default TransactionList;
