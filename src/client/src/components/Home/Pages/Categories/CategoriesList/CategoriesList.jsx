import React from 'react';
import {Grid, Header, Image, Item, Segment} from 'semantic-ui-react';
import styles from './CategoryList.module.css';
import {convertToValidIconUrl} from '../../../../../utils/GlobalUtils';
import {get} from '../../../../../utils/TranslationUtils';


const CategoriesList = ({query, categoryType, onCategoryClick}) => {
    return (
        <Grid columns={2}>
            {query && query.data && query.data.transactionTypes.map(type => (
                <Grid.Column key={type.name}>
                    <Header attached="top" content={get(type.name, 'transactionTypes')}/>
                    <Segment attached loading={query.loading || query.error} className={styles.categoryListColumn}>
                        <Item.Group divided>
                            {(query && query.data
                                && query.data[categoryType]
                                    .filter(category => category.type.name === type.name).map(category => (
                                        <Item key={category.id}>
                                            <Item.Content>
                                                <Image className={styles.categoryIcon} avatar={true}
                                                       src={convertToValidIconUrl(category.iconUrl)}
                                                       onClick={() => onCategoryClick(category)}/>
                                                <Item.Description as="a" onClick={() => onCategoryClick(category)}>
                                                    {category.name}
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    ))) || []}
                        </Item.Group>
                    </Segment>
                </Grid.Column>
            ))}
        </Grid>
    );
};

export default CategoriesList;
