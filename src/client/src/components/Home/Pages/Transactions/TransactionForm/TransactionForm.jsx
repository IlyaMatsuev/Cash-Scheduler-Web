import React from 'react';
import {Grid, Input, Dropdown, Button} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import {useQuery} from '@apollo/client';
import ErrorsList from '../../../../../utils/ErrorsList';
import styles from './TransactionForm.module.css';
import categoriesQueries from '../../../../../graphql/queries/categories';
import {convertToValidIconUrl, toFloat} from '../../../../../utils/GlobalUtils';
import {get} from '../../../../../utils/TranslationUtils';
import {global} from '../../../../../config';
import WalletsDropdown from '../../Wallets/WalletsDropdown/WalletsDropdown';


const TransactionForm = ({isRecurring = false, isEditing = false, transaction, errors, onChange}) => {

    const {
        data: categoriesWithTypes,
        loading: categoriesWithTypesLoading,
        error: categoriesWithTypesError
    } = useQuery(categoriesQueries.GET_ALL_USER_CATEGORIES_WITH_TYPES, {
        variables: {typeName: transaction.type || transaction.category?.type?.name}
    });

    const recurringTransactionIntervals = [
        {key: 'day', value: 'day', text: get('day', 'transactionIntervals')},
        {key: 'week', value: 'week', text: get('week', 'transactionIntervals')},
        {key: 'month', value: 'month', text: get('month', 'transactionIntervals')},
        {key: 'year', value: 'year', text: get('year', 'transactionIntervals')}
    ];

    return (
        <Grid columns={2} padded centered>
            <Grid.Row>
                <Grid.Column>
                    <Input type="text" name="title" placeholder={get('transactionTitle', 'transactions')}
                           error={!!errors.title} value={transaction.title || ''} onChange={onChange}/>
                </Grid.Column>
                <Grid.Column>
                    <Input type="number" name="amount" placeholder={get('transactionAmount', 'transactions')}
                           error={!!errors.amount} value={toFloat(transaction.amount)} onChange={onChange}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {!isRecurring &&
                    <DateInput placeholder={get('transactionDate', 'transactions')} iconPosition="left"
                               dateFormat={global.dateFormat} name="date"
                               className={errors.date ? 'dateFieldError' : ''}
                               value={transaction.date} onChange={onChange}/>}

                    {isRecurring &&
                    <DateInput placeholder={get('transactionNextDate', 'transactions')} iconPosition="left"
                               dateFormat={global.dateFormat}
                               name="nextTransactionDate" disabled={isEditing}
                               className={errors.nextTransactionDate ? 'dateFieldError' : ''}
                               value={transaction.nextTransactionDate} onChange={onChange}/>}
                </Grid.Column>
                <Grid.Column>
                    <Button.Group>
                        <Dropdown className={styles.categoriesDropdown} button deburr fluid scrolling
                                  search selection placeholder={get('transactionCategory', 'transactions')}
                                  name="categoryId" error={!!errors.categoryId}
                                  value={transaction.category?.id} onChange={onChange} disabled={isEditing}
                                  loading={categoriesWithTypesLoading || !!categoriesWithTypesError}
                                  options={
                                      (categoriesWithTypes && categoriesWithTypes.allCategories.map(category => ({
                                          key: category.id,
                                          value: category.id,
                                          text: category.name,
                                          image: {avatar: true, src: convertToValidIconUrl(category.iconUrl)}
                                      }))) || []}/>
                        <Dropdown button floating name="type" disabled={isEditing}
                                  value={transaction.type || transaction.category?.type?.name} onChange={onChange}
                                  loading={categoriesWithTypesLoading || !!categoriesWithTypesError}
                                  options={
                                      categoriesWithTypes && categoriesWithTypes.transactionTypes.map(type => ({
                                          key: type.name,
                                          value: type.name,
                                          text: get(type.name, 'transactionTypes')
                                      }))
                                  }/>
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <WalletsDropdown value={transaction.walletId || transaction.wallet?.id}
                                     placeholder={get('transactionWallet', 'transactions')}
                                     error={!!errors.walletId}
                                     onChange={onChange}
                                     disabled={isEditing}
                    />
                </Grid.Column>
                <Grid.Column>
                    {isRecurring &&
                    <Dropdown search selection name="interval"
                              placeholder={get('transactionInterval', 'transactions')}
                              disabled={isEditing} className={styles.intervalDropdown}
                              error={!!errors.interval} value={transaction.interval} onChange={onChange}
                              options={recurringTransactionIntervals}
                    />}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    );
};

export default TransactionForm;
