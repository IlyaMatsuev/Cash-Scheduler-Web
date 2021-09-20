import React from 'react';
import {Container, Label, Header, Image, Segment} from 'semantic-ui-react';
import {convertToValidIconUrl, toFloat} from '../../../../../../utils/GlobalUtils';
import styles from './WalletItem.module.css';


const WalletItem = ({wallet, color, onWalletSelected}) => {
    return (
        <Segment color={color} padded className={styles.walletItem} onClick={() => onWalletSelected(wallet)}>
            {wallet.isDefault && <Label size="tiny" corner="left" color="teal" className={styles.defaultLabel}/>}
            <Image circular avatar inline spaced="right" size="mini"
                   src={convertToValidIconUrl(wallet.currency.iconUrl)}
            />
            <Header as="span" size="tiny">({wallet.currency.abbreviation})</Header>
            <Header as="span" size="small"> {wallet.name}</Header>
            <Container fluid textAlign="right">
                <Header as="span" size="medium" color="grey">{toFloat(wallet.balance)}</Header>
            </Container>
        </Segment>
    );
};

export default WalletItem;
