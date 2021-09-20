import React from 'react';
import {Segment} from 'semantic-ui-react';
import LineTransactions from './LineTransactions/LineTransactions';
import DoughnutTransactions from './DoughnutTransactions/DoughnutTransactions';
import styles from './Charts.module.css';
import BarTransactions from './BarTransactions/BarTransactions';


const Charts = ({transactions = [], recurringTransactions = [], transactionsDelta = [], transactionsLoading, transactionsError, isRecurring}) => {
    return (
        <Segment basic className={styles.container}>
            <Segment>
                <LineTransactions transactions={transactions}
                                  recurringTransactions={recurringTransactions}
                                  transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                  isRecurring={isRecurring}
                                  chartType='amountSummary'
                />
            </Segment>
            <Segment>
                <LineTransactions transactions={transactions}
                                  recurringTransactions={recurringTransactions}
                                  transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                  isRecurring={isRecurring}
                                  chartType='countPerDay'
                />
            </Segment>
            <Segment>
                <DoughnutTransactions transactions={transactions}
                                      recurringTransactions={recurringTransactions}
                                      transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                      isRecurring={isRecurring}
                />
            </Segment>
            <Segment>
                <BarTransactions transactionsDelta={transactionsDelta}
                                 transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                 isRecurring={isRecurring}
                />
            </Segment>
        </Segment>
    );
};

export default Charts;
