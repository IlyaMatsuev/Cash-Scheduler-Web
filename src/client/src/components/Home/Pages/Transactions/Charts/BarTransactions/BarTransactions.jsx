import React from 'react';
import {Container, Dimmer, Loader} from 'semantic-ui-react';
import {Bar} from 'react-chartjs-2';
import moment from 'moment';
import {generateBackgroundColor, generateBorderColor} from '../ColorUtils';
import {get} from "../../../../../../utils/TranslationUtils";


const BarTransactions = ({transactionsDelta = [], transactionsLoading, transactionsError, isRecurring}) => {
    const getSortedTransactions = transactions => {
        return moment.months().map(monthName => ({
            month: monthName,
            delta: transactions.find(t => t.month === monthName)?.delta || 0
        }));
    };

    const getChartData = transactions => {
        const getType = transaction => transaction.delta > 0 ? 'Income' : 'Expense';
        const sortedTransactions = getSortedTransactions(transactions);
        return {
            labels: sortedTransactions.map(t => get(t.month, 'months')),
            datasets: [{
                data: sortedTransactions.map(t => t.delta),
                backgroundColor: sortedTransactions.map(t => generateBackgroundColor(getType(t), 0.2)),
                borderColor: sortedTransactions.map(t => generateBorderColor(getType(t))),
                borderWidth: 1
            }]
        };
    };

    const options = {
        title: {
            text: (isRecurring ? `${get('recurring', 'transactions')}: ` : '')
                + get('deltaPerYearChartTitle', 'transactions'),
            display: true,
            fontSize: 22,
            fontColor: 'rgba(0, 0, 0, .54)'
        },
        legend: {display: false}
    };

    return (
        <Container fluid>
            <Dimmer active={transactionsLoading || !!transactionsError} inverted>
                <Loader inverted>Loading</Loader>
            </Dimmer>
            <Bar data={getChartData(transactionsDelta)} options={options} height={125}/>
        </Container>
    );
};

export default BarTransactions;
