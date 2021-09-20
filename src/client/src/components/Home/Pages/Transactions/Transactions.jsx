import React, {useState} from 'react';
import {Dimmer, Grid, Loader} from 'semantic-ui-react';
import moment from 'moment';
import {useMutation, useQuery} from '@apollo/client';
import TransactionList from './TransactionList/TransactionList';
import {isValidNumber, onUIErrors, toFloat} from '../../../../utils/GlobalUtils';
import {removeEntityCache, updateEntityCache} from '../../../../utils/CacheUtils';
import errorDefs from '../../../../utils/ErrorDefinitions';
import {global} from '../../../../config';
import userQueries from '../../../../graphql/queries/users';
import transactionQueries from '../../../../graphql/queries/transactions';
import transactionMutations from '../../../../graphql/mutations/transactions';
import transactionFragments from '../../../../graphql/fragments/transactions';
import TransactionModal from './TransactionModal/TransactionModal';
import Charts from './Charts/Charts';


const Transactions = ({currentDate, isRecurringView, onTransactionPropsChange}) => {
    const initialState = {
        recurringTransactions: [],
        transactionModalOpened: false,
        transactionDeleteModalOpened: false,
        selectedTransaction: {}
    };
    const [state, setState] = useState(initialState);
    const [errors, setErrors] = useState({});

    const {
        loading: transactionsLoading,
        error: transactionsError,
        data: transactionsData
    } = useQuery(transactionQueries.GET_TRANSACTIONS_BY_MONTH, {
        variables: {
            month: currentDate.month() + 1,
            year: currentDate.year(),
            isRecurring: isRecurringView
        }
    });

    const [
        updateTransaction,
        {loading: updateTransactionLoading}
    ] = useMutation(transactionMutations.UPDATE_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                const updatedTransaction = result.data.updateTransaction;
                updateEntityCache(
                    cache,
                    updatedTransaction,
                    transactionFragments.UPDATED_TRANSACTION,
                    {
                        title: updatedTransaction.title,
                        amount: updatedTransaction.amount,
                        date: updatedTransaction.date
                    }
                );
            }
        },
        refetchQueries: [{query: userQueries.GET_USER_WITH_BALANCE}],
        variables: {
            transaction: {
                id: state.selectedTransaction.id,
                title: state.selectedTransaction.title,
                amount: toFloat(state.selectedTransaction.amount),
                date: state.selectedTransaction.date
            }
        }
    });

    const [
        updateRecurringTransaction,
        {loading: updateRecurringTransactionLoading}
    ] = useMutation(transactionMutations.UPDATE_RECURRING_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                const updatedTransaction = result.data.updateRegularTransaction;
                updateEntityCache(
                    cache,
                    updatedTransaction,
                    transactionFragments.UPDATED_RECURRING_TRANSACTION,
                    {
                        title: updatedTransaction.title,
                        amount: updatedTransaction.amount
                    }
                );
            }
        },
        variables: {
            transaction: {
                id: state.selectedTransaction.id,
                title: state.selectedTransaction.title,
                amount: toFloat(state.selectedTransaction.amount)
            }
        }
    });

    const [
        deleteTransaction,
        {loading: deleteTransactionLoading}
    ] = useMutation(transactionMutations.DELETE_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                removeEntityCache(
                    cache,
                    result.data.deleteTransaction,
                    ['dashboardTransactions', 'transactionsByMonth']
                );
            }
        },
        refetchQueries: [{query: userQueries.GET_USER_WITH_BALANCE}],
        variables: {id: state.selectedTransaction.id}
    });

    const [
        deleteRecurringTransaction,
        {loading: deleteRecurringTransactionLoading}
    ] = useMutation(transactionMutations.DELETE_RECURRING_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                removeEntityCache(
                    cache,
                    result.data.deleteRegularTransaction,
                    ['dashboardRecurringTransactions', 'recurringTransactionsByMonth']
                );
            }
        },
        variables: {id: state.selectedTransaction.id}
    });


    const validateTransaction = () => {
        let valid = true;
        if (!state.selectedTransaction.date
            || moment(state.selectedTransaction.date, global.dateFormat).format(global.dateFormat) !== state.selectedTransaction.date) {
            setErrors({
                ...errors,
                date: errorDefs.INVALID_TRANSACTION_DATE_ERROR
            });
            valid = false;
        }
        return valid;
    };


    const onPrevMonth = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.subtract(1, 'month')});
    };

    const onNextMonth = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.add(1, 'month')});
    };

    const onTransactionsViewChange = () => {
        onTransactionPropsChange({name: 'isRecurringView', value: !isRecurringView});
    };

    const onSelectedTransactionToggle = transaction => {
        if (transaction) {
            state.selectedTransaction = transaction;
        }
        setState({...state, transactionModalOpened: !state.transactionModalOpened});
        setErrors({});
    };

    const onSelectedTransactionChange = (event, {name, type, value}) => {
        if (type === 'number' && !isValidNumber(value)) {
            return;
        }
        setState({...state, selectedTransaction: {...state.selectedTransaction, [name]: value}});
        setErrors({...errors, [name]: undefined});
    };

    const onSelectedTransactionSave = () => {
        setErrors({});
        if (validateTransaction()) {
            if (isRecurringView) {
                updateRecurringTransaction();
            } else {
                updateTransaction();
            }
        }
    };

    const onSelectedTransactionDelete = () => {
        if (isRecurringView) {
            deleteRecurringTransaction();
        } else {
            deleteTransaction();
        }
        onTransactionDeleteToggle();
    };

    const onTransactionDeleteToggle = () => {
        setState({...state, transactionDeleteModalOpened: !state.transactionDeleteModalOpened});
    };


    return (
        <Grid padded centered columns={2}>
            <Grid.Column width={10}>
                <Charts transactions={transactionsData && transactionsData.transactionsByMonth}
                        recurringTransactions={transactionsData && transactionsData.recurringTransactionsByMonth}
                        transactionsDelta={transactionsData && transactionsData.transactionsDelta}
                        transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                        isRecurring={isRecurringView}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                <Dimmer inverted
                        active={updateTransactionLoading
                            || deleteTransactionLoading
                            || updateRecurringTransactionLoading
                            || deleteRecurringTransactionLoading}>
                    <Loader inverted/>
                </Dimmer>
                <TransactionList date={currentDate} isRecurring={isRecurringView}
                                 transactions={transactionsData && transactionsData.transactionsByMonth}
                                 recurringTransactions={transactionsData && transactionsData.recurringTransactionsByMonth}
                                 transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                 onPrevMonth={onPrevMonth} onNextMonth={onNextMonth}
                                 onTransactionSelected={onSelectedTransactionToggle}
                                 onTransactionsViewChange={onTransactionsViewChange}
                />

                <TransactionModal open={state.transactionModalOpened} isRecurring={isRecurringView}
                                  transaction={state.selectedTransaction} errors={errors}
                                  onModalToggle={onSelectedTransactionToggle}
                                  deleteModalOpen={state.transactionDeleteModalOpened}
                                  onDeleteModalToggle={onTransactionDeleteToggle}
                                  deleteLoading={deleteTransactionLoading} saveLoading={updateTransactionLoading}
                                  onChange={onSelectedTransactionChange}
                                  onSave={onSelectedTransactionSave} onDelete={onSelectedTransactionDelete}
                />
            </Grid.Column>
        </Grid>
    );
};

export default Transactions;
