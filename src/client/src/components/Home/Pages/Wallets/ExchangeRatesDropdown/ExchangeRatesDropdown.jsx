import React from 'react';
import {Dropdown} from 'semantic-ui-react';
import moment from 'moment';
import {useQuery, useMutation} from '@apollo/client';
import {onNumberInput, toFloat} from '../../../../../utils/GlobalUtils';
import {get} from '../../../../../utils/TranslationUtils';
import currencyQueries from '../../../../../graphql/queries/currencies';
import currencyMutations from '../../../../../graphql/mutations/currencies';
import styles from './ExchangeRatesDropdown.module.css';
import {global} from '../../../../../config';


const ExchangeRatesDropdown = ({sourceCurrency, targetCurrency, value, error, onChange}) => {
    const {
        data: exchangeRatesQueryData,
        loading: exchangeRatesQueryLoading,
        error: exchangeRatesQueryError
    } = useQuery(currencyQueries.GET_RATES_BY_SOURCE_AND_TARGET, {
        fetchPolicy: 'network-only',
        variables: {
            source: sourceCurrency,
            target: targetCurrency
        }
    });

    const [
        createExchangeRate,
        {loading: createExchangeRateLoading, error: createExchangeRateError}
    ] = useMutation(currencyMutations.CREATE_EXCHANGE_RATE);


    const onNewRateAdd = (event, {value}) => {
        createExchangeRate({
            variables: {
                exchangeRate: {
                    sourceCurrencyAbbreviation: sourceCurrency,
                    targetCurrencyAbbreviation: targetCurrency,
                    exchangeRate: toFloat(value),
                    validFrom: moment().format(global.dateFormat),
                    validTo: moment().format(global.dateFormat)
                }
            },
            refetchQueries: [{
                query: currencyQueries.GET_RATES_BY_SOURCE_AND_TARGET,
                variables: {
                    source: sourceCurrency,
                    target: targetCurrency
                }
            }]
        });
    };

    return (
        <Dropdown deburr scrolling search selection className={styles.dropdown}
                  loading={
                      exchangeRatesQueryLoading || !!exchangeRatesQueryError
                      || createExchangeRateLoading || !!createExchangeRateError}
                  placeholder={get('exchangeRate', 'currencies')}
                  name="exchangeRate"
                  allowAdditions additionLabel={`${get('addExchangeRate', 'currencies')}: `}
                  onAddItem={onNewRateAdd}
                  value={value} error={error}
                  onChange={onChange} onInput={onNumberInput}
                  options={
                      (exchangeRatesQueryData && exchangeRatesQueryData.exchangeRates.map(rate => ({
                          key: rate.id,
                          text: rate.exchangeRate.toFixed(2),
                          value: rate.exchangeRate.toFixed(2)
                      }))) || []}
        />
    );
};

export default ExchangeRatesDropdown;
