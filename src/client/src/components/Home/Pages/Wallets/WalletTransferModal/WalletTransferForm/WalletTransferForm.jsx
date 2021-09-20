import React from 'react';
import {Grid, Input} from 'semantic-ui-react';
import ErrorsList from '../../../../../../utils/ErrorsList';
import WalletsDropdown from '../../WalletsDropdown/WalletsDropdown';
import {toFloat} from '../../../../../../utils/GlobalUtils';
import {get} from '../../../../../../utils/TranslationUtils';
import ExchangeRatesDropdown from '../../ExchangeRatesDropdown/ExchangeRatesDropdown';
import {useQuery} from '@apollo/client';
import walletQueries from '../../../../../../graphql/queries/wallets';


const WalletTransferForm = ({transfer, sourceWallet, targetWallet, errors, onChange}) => {

    const {data: walletsQueryData} = useQuery(walletQueries.GET_WALLETS);

    let sourceCurrencyAbbreviation = sourceWallet?.currency?.abbreviation;
    let targetCurrencyAbbreviation = targetWallet?.currency?.abbreviation;

    if (walletsQueryData && walletsQueryData.wallets) {
        if (transfer.sourceWalletId) {
            const sourceWalletById = walletsQueryData.wallets.find(w => w.id === transfer.sourceWalletId);
            sourceCurrencyAbbreviation = sourceWalletById.currency.abbreviation;
        }
        if (transfer.targetWalletId) {
            const targetWalletById = walletsQueryData.wallets.find(w => w.id === transfer.targetWalletId);
            targetCurrencyAbbreviation = targetWalletById.currency.abbreviation;
        }
    }


    return (
        <Grid columns={2} padded centered>
            <Grid.Row>
                <Grid.Column>
                    <WalletsDropdown value={transfer.sourceWalletId || sourceWallet.id}
                                     error={!!errors.sourceWalletId} name="sourceWalletId"
                                     onChange={onChange}
                                     placeholder={get('transferSourceWallet', 'wallets')}
                    />
                </Grid.Column>
                <Grid.Column>
                    <WalletsDropdown value={transfer.targetWalletId || targetWallet.id}
                                     error={!!errors.targetWalletId} name="targetWalletId"
                                     onChange={onChange}
                                     placeholder={get('transferTargetWallet', 'wallets')}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Input type="number" name="amount"
                           placeholder={get('transferAmount', 'wallets')}
                           value={toFloat(transfer.amount)} error={!!errors.amount}
                           onChange={onChange}
                    />
                </Grid.Column>
                <Grid.Column/>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <ExchangeRatesDropdown value={transfer.exchangeRate} error={!!errors.exchangeRate}
                                           sourceCurrency={sourceCurrencyAbbreviation}
                                           targetCurrency={targetCurrencyAbbreviation}
                                           onChange={onChange}
                    />
                </Grid.Column>
                <Grid.Column/>
            </Grid.Row>
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    );
};

export default WalletTransferForm;
