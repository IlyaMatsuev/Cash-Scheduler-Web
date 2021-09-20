import React from 'react';
import styles from './TransactionModal.module.css';
import {Button, Confirm, Modal} from 'semantic-ui-react';
import TransactionForm from '../TransactionForm/TransactionForm';
import {get} from '../../../../../utils/TranslationUtils';


const TransactionModal = ({
                              open,
                              isRecurring,
                              isEditing = true,
                              transaction,
                              errors,
                              onModalToggle,
                              deleteModalOpen,
                              onDeleteModalToggle,
                              deleteLoading,
                              saveLoading,
                              onChange,
                              onSave,
                              onDelete
}) => {

    const getHeader = () => {
        const label = `${isEditing ? 'edit' : 'new'}${isRecurring ? 'Recurring' : ''}Transaction`;
        return get(label, 'transactions');
    };

    return (
        <Modal dimmer size="small" className={styles.transactionModal + ' modalContainer'}
               closeOnEscape closeOnDimmerClick
               open={open} onClose={onModalToggle}>
            <Modal.Header content={getHeader()}/>
            <Modal.Content>
                <TransactionForm transaction={transaction} errors={errors} isEditing={isEditing}
                                 isRecurring={isRecurring} onChange={onChange}/>
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={onModalToggle} content={get('cancel')}/>
                {isEditing && <Button basic color="red"
                                      onClick={onDeleteModalToggle}
                                      loading={deleteLoading}
                                      content={get('delete')}
                />}
                <Button primary loading={saveLoading} onClick={onSave} content={get('save')}/>
            </Modal.Actions>

            <Confirm className="modalContainer"
                     content={get('deleteConfirmMessage', 'transactions')}
                     cancelButton={<Button basic content={get('cancel')}/>}
                     confirmButton={<Button basic negative content={get('confirmDelete')}/>}
                     open={deleteModalOpen}
                     onCancel={onDeleteModalToggle} onConfirm={onDelete}
            />
        </Modal>
    );
};

export default TransactionModal;
