import React from 'react';
import {Dropdown, Header} from 'semantic-ui-react';
import {useQuery} from '@apollo/client';
import walletQueries from '../../../../../graphql/queries/wallets';
import {convertToValidIconUrl} from '../../../../../utils/GlobalUtils';
import styles from './WalletsDropdown.module.css';


const WalletsDropdown = ({value, error, placeholder = 'Wallet', name = 'walletId', disabled = false, onChange}) => {

    const {
        data: walletsQueryData,
        loading: walletsQueryLoading,
        error: walletsQueryError
    } = useQuery(walletQueries.GET_WALLETS);

    return (
        <Dropdown deburr scrolling search selection
                  loading={walletsQueryLoading || !!walletsQueryError}
                  disabled={disabled} className={styles.walletsDropdown}
                  placeholder={placeholder} name={name}
                  error={error}
                  value={value}
                  onChange={onChange}
                  options={
                      (walletsQueryData && walletsQueryData.wallets.map(wallet => ({
                          key: wallet.id,
                          value: wallet.id,
                          text: `${wallet.currency.abbreviation} - ${wallet.name}`,
                          content: (
                              <Header as="span" size="tiny" textAlign="center">
                                  {wallet.currency.abbreviation} - {wallet.name}
                              </Header>
                          ),
                          image: {avatar: true, src: convertToValidIconUrl(wallet.currency.iconUrl)}
                      }))) || []}
        />
    );
};

export default WalletsDropdown;
