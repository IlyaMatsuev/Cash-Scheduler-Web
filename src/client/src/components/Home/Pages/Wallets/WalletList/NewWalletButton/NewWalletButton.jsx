import React from 'react';
import {Container, Grid, Icon} from 'semantic-ui-react';
import styles from './NewWalletButton.module.css';


const NewWalletButton = ({onClick}) => {
    return (
        <Grid.Column>
            <Container fluid textAlign="center" onClick={onClick}
                       className={'border rounded shadow-sm ' + styles.buttonContainer}>
                <Icon name="plus" color="teal"
                      size="massive" className={styles.plus}
                />
            </Container>
        </Grid.Column>
    );
};

export default NewWalletButton;
