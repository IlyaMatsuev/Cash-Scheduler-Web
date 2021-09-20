import React, {useState} from 'react';
import moment from 'moment';
import {global} from '../../../../../config';
import {useMutation} from '@apollo/client';
import transactionMutations from '../../../../../graphql/mutations/transactions';
import {isValidNumber, onUIErrors, toFloat} from '../../../../../utils/GlobalUtils';
import {createEntityCache} from '../../../../../utils/CacheUtils';
import transactionFragments from '../../../../../graphql/fragments/transactions';
import userQueries from '../../../../../graphql/queries/users';
import errorDefs from '../../../../../utils/ErrorDefinitions';
import TransactionModal from '../TransactionModal/TransactionModal';


const NewTransactionModal = ({isRecurring, open, onModalToggle}) => {
    const initialState = {
        transaction: {
            title: '',
            amount: 0,
            date: moment().format(global.dateFormat),
            nextTransactionDate: moment().add(1, 'month').format(global.dateFormat),
            categoryId: 0,
            type: 'Expense',
            interval: 'month'
        }
    };
    const [state, setState] = useState(initialState);
    const [errors, setErrors] = useState({});


    const onTransactionModalToggle = () => {
        onModalToggle();
        setState(initialState);
        setErrors({});
    };

    const [
        createTransaction,
        {loading: createTransactionLoading}
    ] = useMutation(transactionMutations.CREATE_TRANSACTION, {
        onCompleted() {
            onTransactionModalToggle();
        },
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                createEntityCache(
                    cache,
                    result.data.createTransaction,
                    ['dashboardTransactions', 'transactionsByMonth'],
                    transactionFragments.NEW_TRANSACTION,
                    {
                        dashboardTransactions: {
                            month: moment(state.transaction.date).month() + 1,
                            year: moment(state.transaction.date).year()
                        },
                        transactionsByMonth: {
                            month: moment(state.transaction.date).month() + 1,
                            year: moment(state.transaction.date).year()
                        }
                    }
                )
            }
        },
        refetchQueries: [{query: userQueries.GET_USER_WITH_BALANCE}],
        variables: {
            transaction: {
                title: state.transaction.title,
                amount: toFloat(state.transaction.amount),
                categoryId: state.transaction.categoryId,
                walletId: state.transaction.walletId,
                date: state.transaction.date
            }
        }
    });

    const [
        createRecurringTransaction,
        {loading: createRecurringTransactionLoading}
    ] = useMutation(transactionMutations.CREATE_RECURRING_TRANSACTION, {
        onCompleted() {
            onTransactionModalToggle();
        },
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                createEntityCache(
                    cache,
                    result.data.createRegularTransaction,
                    ['dashboardRecurringTransactions', 'recurringTransactionsByMonth'],
                    transactionFragments.NEW_RECURRING_TRANSACTION,
                    {
                        dashboardRecurringTransactions: {
                            month: moment(state.transaction.date).month() + 1,
                            year: moment(state.transaction.date).year()
                        },
                        recurringTransactionsByMonth: {
                            month: moment(state.transaction.date).month() + 1,
                            year: moment(state.transaction.date).year()
                        }
                    }
                )
            }
        },
        refetchQueries: [{query: userQueries.GET_USER_WITH_BALANCE}],
        variables: {
            transaction: {
                title: state.transaction.title,
                amount: toFloat(state.transaction.amount),
                categoryId: state.transaction.categoryId,
                walletId: state.transaction.walletId,
                nextTransactionDate: state.transaction.nextTransactionDate,
                interval: state.transaction.interval
            }
        }
    });


    const validateTransaction = () => {
        let valid = true;
        if (!state.transaction.date
            || moment(state.transaction.date, global.dateFormat).format(global.dateFormat) !== state.transaction.date
        ) {
            setErrors({date: errorDefs.INVALID_TRANSACTION_DATE_ERROR});
            valid = false;
        }
        return valid;
    };

    const onChange = (event, {name, value, type}) => {
        if (type === 'number' && !isValidNumber(value)) {
            return;
        }
        if (name === 'type') {
            state.transaction.category = '';
        }
        if (name === 'interval') {
            state.transaction.nextTransactionDate = moment().add(1, value).format(global.dateFormat);
        }
        setErrors({...errors, [name]: undefined});
        setState({...state, transaction: {...state.transaction, [name]: value}})
    };

    const onSave = () => {
        setErrors({});
        if (validateTransaction()) {
            if (isRecurring) {
                createRecurringTransaction();
            } else {
                createTransaction();
            }
        }
    };


    return (
        <TransactionModal open={open}
                          onModalToggle={onTransactionModalToggle}
                          isRecurring={isRecurring}
                          isEditing={false}
                          transaction={state.transaction}
                          errors={errors}
                          saveLoading={createTransactionLoading || createRecurringTransactionLoading}
                          onChange={onChange}
                          onSave={onSave}
        />
    );
};

export default NewTransactionModal;
