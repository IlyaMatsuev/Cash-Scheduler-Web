import React from 'react';
import {Container, Dimmer, Grid, Loader} from 'semantic-ui-react';
import {Doughnut} from 'react-chartjs-2';
import {generateBackgroundColor, generateBorderColor} from '../ColorUtils';
import {get} from '../../../../../../utils/TranslationUtils';


const DoughnutTransactions = ({transactions = [], recurringTransactions = [], transactionsLoading, transactionsErrors, isRecurring}) => {
    const getSummariesByCategories = transactions => {
        let summariesByCategories = [];
        transactions.reduce((transactionsByCategoriesTemp, transaction) => {
            if (transactionsByCategoriesTemp[transaction.category.name]) {
                transactionsByCategoriesTemp[transaction.category.name].amount += transaction.amount;
            } else {
                transactionsByCategoriesTemp[transaction.category.name] = {
                    category: {name: transaction.category.name},
                    amount: transaction.amount
                };
                summariesByCategories.push(transactionsByCategoriesTemp[transaction.category.name]);
            }
            return transactionsByCategoriesTemp;
        }, {category: {name: transactions[0].category.name}, amount: transactions[0].amount});
        return summariesByCategories.map(t => ({...t, amount: t.amount.toFixed(2)}))
    };

    const getDataByType = (transactions, type) => {
        const records = transactions.filter(t => t.category.type.name === type);
        if (!records || records.length === 0) {
            return {};
        }
        const summariesByCategories = getSummariesByCategories(records);
        return {
            labels: summariesByCategories.map(t => t.category.name),
            datasets: [{
                data: summariesByCategories.map(t => t.amount),
                backgroundColor: summariesByCategories.map(() => generateBackgroundColor(type)),
                borderColor: summariesByCategories.map(() => generateBorderColor(type)),
                borderWidth: 1
            }]
        };
    };

    const getOptions = title => {
        return {
            title: {
                text: get(title, 'transactionTypes'),
                display: true,
                fontSize: 22,
                fontColor: 'rgba(0, 0, 0, .54)'
            },
            legend: {display: false},
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    bottom: 20
                }
            }
        };
    };

    return (
        <Container fluid>
            <Dimmer active={transactionsLoading || transactionsErrors} inverted>
                <Loader inverted/>
            </Dimmer>
            <Grid columns={2}>
                <Grid.Column>
                    {!isRecurring && <Doughnut data={getDataByType(transactions, 'Income')}
                                               options={getOptions('Incomes')}
                                               height={150}
                    />}
                    {isRecurring && <Doughnut data={getDataByType(recurringTransactions, 'Income')}
                                              options={getOptions('RecurringIncome')}
                                              height={150}
                    />}
                </Grid.Column>
                <Grid.Column>
                    {!isRecurring && <Doughnut data={getDataByType(transactions, 'Expense')}
                                               options={getOptions('Expenses')}
                                               height={150}
                    />}
                    {isRecurring && <Doughnut data={getDataByType(recurringTransactions, 'Expense')}
                                              options={getOptions('RecurringExpenses')}
                                              height={150}
                    />}
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default DoughnutTransactions;
