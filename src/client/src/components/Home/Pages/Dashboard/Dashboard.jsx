import React, {useState} from 'react';
import Calendar from './Calendar/Calendar';
import {Button, Container, Segment} from 'semantic-ui-react';
import styles from './Dashboard.module.css';
import moment from 'moment';
import {useQuery} from '@apollo/client';
import transactionQueries from '../../../../graphql/queries/transactions';
import NewTransactionModal from '../Transactions/NewTransactionModal/NewTransactionModal';
import {get} from '../../../../utils/TranslationUtils';


const Dashboard = ({currentDate, onTransactionPropsChange}) => {
    const initialState = {
        transactionModalOpen: false,
        isRecurring: false
    };
    const [state, setState] = useState(initialState);

    const {
        loading: transactionsLoading,
        error: transactionsError,
        data: transactions
    } = useQuery(transactionQueries.GET_DASHBOARD_TRANSACTIONS, {
        variables: {month: currentDate.month() + 1, year: currentDate.year()}
    });


    const onToday = () => {
        onTransactionPropsChange({name: 'currentDate', value: moment()});
    };

    const onTurnLeft = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.subtract(1, 'month')});
    };

    const onTurnRight = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.add(1, 'month')});
    };

    const onNewTransactionModalToggle = isRecurring => {
        if (isRecurring === undefined) {
            isRecurring = state.isRecurring;
        }
        setState({...state, isRecurring, transactionModalOpen: !state.transactionModalOpen});
    };

    const getCurrentDate = () => {
        return get(currentDate.format('MMMM'), 'months') + ', ' + currentDate.year();
    };


    return (
        <div className="fullHeight">
            <Segment>
                <Container>
                    <Button active={currentDate.isSame(moment(), 'month')} onClick={onToday} content={get('today', 'dashboard')}/>
                    <Button icon="chevron left" className="ml-2 mr-3" onClick={onTurnLeft}/>
                    <span className={styles.displayedDate}>{getCurrentDate()}</span>
                    <Button icon="chevron right" className="ml-3 mr-2" onClick={onTurnRight}/>

                    <Button.Group color="blue" floated="right">
                        <Button onClick={() => onNewTransactionModalToggle(false)} content={get('transaction', 'dashboard')}/>
                        <Button onClick={() => onNewTransactionModalToggle(true)} content={get('recurringTransaction', 'dashboard')}/>
                    </Button.Group>
                </Container>
            </Segment>
            <Segment padded textAlign="center" className={styles.calendarWrapper}
                     loading={transactionsLoading || !!transactionsError}>
                {transactions && (
                    <Calendar targetDate={currentDate} transactions={transactions.dashboardTransactions}
                              recurringTransactions={transactions.dashboardRecurringTransactions}/>
                )}
            </Segment>

            <NewTransactionModal open={state.transactionModalOpen}
                                 onModalToggle={onNewTransactionModalToggle}
                                 isRecurring={state.isRecurring}
            />
        </div>
    );
};

export default Dashboard;
