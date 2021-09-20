import React, {useState} from 'react';
import {Segment} from 'semantic-ui-react';
import walletQueries from '../../../../graphql/queries/wallets';
import {useQuery} from '@apollo/client';
import WalletEditModal from './WalletEditModal/WalletEditModal';
import {isValidNumber} from '../../../../utils/GlobalUtils';
import {global} from '../../../../config';
import WalletList from './WalletList/WaleltList';
import WalletTransferModal from './WalletTransferModal/WalletTransferModal';


const Wallets = () => {
    const initState = {
        walletModalOpen: false,
        walletTransferModalOpen: false,
        isWalletEditing: true,
        selectedWallet: {},
        sourceTransferWallet: {},
        targetTransferWallet: {}
    };
    const [state, setState] = useState(initState);

    const {
        data: walletsQueryData,
        loading: walletsQueryLoading,
        error: walletsQueryError
    } = useQuery(walletQueries.GET_WALLETS);

    const onWalletEditModalToggle = (wallet = {}, isEditing = true) => {
        setState({
            ...state,
            selectedWallet: {
                ...wallet,
                originalCurrency: wallet.currency?.abbreviation,
                originallyDefault: wallet.isDefault
            },
            walletModalOpen: !state.walletModalOpen,
            isWalletEditing: isEditing
        });
    };

    const onWalletTransferModalToggle = (sourceWallet = {}, targetWallet = {}) => {
        setState({
            ...state,
            walletTransferModalOpen: !state.walletTransferModalOpen,
            sourceTransferWallet: sourceWallet,
            targetTransferWallet: targetWallet
        });
    };

    const onWalletChange = (event, {name, type, value, checked}) => {
        const selectedWallet = {
            ...state.selectedWallet,
            [name]: (value || checked)
        };
        if (name === 'currencyAbbreviation') {
            if (!state.currencyChanged) {
                selectedWallet.currencyChanged = true;
                selectedWallet.convertBalance = true;
            }
            if (selectedWallet.originalCurrency === value) {
                selectedWallet.currencyChanged = false;
                selectedWallet.convertBalance = false;
            }
        }
        if (type === 'number' && !isValidNumber(value)) {
            return;
        }
        setState({...state, selectedWallet});
    };

    const onWalletActionComplete = () => {
        setState({...state, walletModalOpen: false, selectedWallet: {}});
    };

    const onNewWallet = () => {
        onWalletEditModalToggle(
            {
                name: '',
                balance: 0,
                currency: global.defaultCurrency,
                isDefault: false
            },
            false
        );
    };


    return (
        <Segment loading={walletsQueryLoading || !!walletsQueryError}
                 className="fullHeight"
                 padded="very"
        >
            {walletsQueryData &&
            <WalletList wallets={walletsQueryData.wallets}
                        onNewWallet={onNewWallet}
                        onWalletSelected={onWalletEditModalToggle}
                        onWalletsTransfer={onWalletTransferModalToggle}
            />}

            <WalletEditModal open={state.walletModalOpen}
                             isEditing={state.isWalletEditing}
                             wallet={state.selectedWallet}
                             onWalletChange={onWalletChange}
                             onWalletActionComplete={onWalletActionComplete}
                             onModalToggle={onWalletEditModalToggle}
            />

            <WalletTransferModal open={state.walletTransferModalOpen}
                                 sourceWallet={state.sourceTransferWallet}
                                 targetWallet={state.targetTransferWallet}
                                 onModalToggle={onWalletTransferModalToggle}
            />
        </Segment>
    );
};

export default Wallets;
