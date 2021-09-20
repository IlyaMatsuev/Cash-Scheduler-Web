import React, {useState} from 'react';
import {Button, Modal} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import WalletTransferForm from './WalletTransferForm/WalletTransferForm';
import {isValidNumber, onUIErrors, toFloat} from '../../../../../utils/GlobalUtils';
import {updateEntityCache} from '../../../../../utils/CacheUtils';
import {get} from '../../../../../utils/TranslationUtils';
import userQueries from '../../../../../graphql/queries/users';
import walletMutations from '../../../../../graphql/mutations/wallets';
import walletFragments from '../../../../../graphql/fragments/wallets';


const WalletTransferModal = ({open, sourceWallet, targetWallet, onModalToggle}) => {
    const initState = {
        transfer: {
            sourceWalletId: sourceWallet?.id,
            targetWalletId: targetWallet?.id,
            amount: 0,
            exchangeRate: 0
        }
    };
    const [state, setState] = useState(initState);
    const [errors, setErrors] = useState({});

    const [createTransfer, {loading: createTransferLoading}] = useMutation(walletMutations.CREATE_TRANSFER, {
        onCompleted: () => onTransferModalToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                const createdTransfer = result.data.createTransfer;
                updateEntityCache(
                    cache,
                    createdTransfer.sourceWallet,
                    walletFragments.UPDATE_WALLET_AFTER_TRANSFER,
                    {balance: createdTransfer.sourceWallet.balance}
                );
                updateEntityCache(
                    cache,
                    createdTransfer.targetWallet,
                    walletFragments.UPDATE_WALLET_AFTER_TRANSFER,
                    {balance: createdTransfer.targetWallet.balance}
                );
            }
        },
        variables: {
            transfer: {
                sourceWalletId: state.transfer.sourceWalletId || sourceWallet.id,
                targetWalletId: state.transfer.targetWalletId || targetWallet.id,
                amount: toFloat(state.transfer.amount),
                exchangeRate: toFloat(state.transfer.exchangeRate)
            }
        },
        refetchQueries: [{query: userQueries.GET_USER_WITH_BALANCE}]
    });


    const onTransferModalToggle = () => {
        setState(initState);
        setErrors({});
        onModalToggle();
    };

    const onTransferChange = (event, {name, type, value}) => {
        if (type === 'number' && !isValidNumber(value)) {
            return;
        }
        setState({...state, transfer: {...state.transfer, [name]: value}});
        setErrors({...errors, general: undefined, [name]: undefined});
    };

    const onTransferSave = () => {
        createTransfer();
    };

    return (
        <Modal dimmer size="small" closeOnEscape
               closeOnDimmerClick className="modalContainer"
               open={open} onClose={onTransferModalToggle}
        >
            <Modal.Header content={get('newTransfer', 'wallets')}/>
            <Modal.Content>
                <WalletTransferForm transfer={state.transfer}
                                    sourceWallet={sourceWallet} targetWallet={targetWallet}
                                    errors={errors} onChange={onTransferChange}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={onTransferModalToggle}
                        content={get('cancel')}
                />
                <Button primary onClick={onTransferSave}
                        loading={createTransferLoading}
                        content={get('transfer')}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default WalletTransferModal;
