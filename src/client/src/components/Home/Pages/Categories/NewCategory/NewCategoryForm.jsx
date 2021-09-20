import React from 'react';
import {Button, Container, Divider, Dropdown, Form, Grid} from 'semantic-ui-react';
import {server} from '../../../../../config';
import {get} from '../../../../../utils/TranslationUtils';


const NewCategoryForm = ({category, query, errors, onCategoryChange, onCategoryCreate}) => {
    return (
        <Form onSubmit={onCategoryCreate}>
            <Container textAlign="center">
                <h3>{get('newCategory', 'categories')}</h3>
            </Container>
            <Divider hidden/>
            <Grid columns={2} padded>
                <Grid.Column>
                    <Form.Input fluid name="name" type="text"
                                placeholder={get('categoryName', 'categories')}
                                error={errors.name} value={category.name}
                                onChange={onCategoryChange}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Dropdown fluid name="transactionTypeName" selection
                              placeholder={get('categoryType', 'categories')}
                              loading={query.loading || query.error}
                              error={errors.transactionTypeName} value={category.transactionTypeName}
                              onChange={onCategoryChange}
                              options={
                                  (query && query.data
                                      && query.data.transactionTypes.map(type => ({
                                          key: type.name,
                                          value: type.name,
                                          text: get(type.name, 'transactionTypes'),
                                          image: {src: `${server.root}${type.iconUrl}`}
                                      }))) || []
                              }
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Form.Input fluid name="iconUrl" type="text"
                                placeholder={get('categoryIconUrl', 'categories')}
                                error={errors.iconUrl} value={category.iconUrl}
                                onChange={onCategoryChange}
                    />
                </Grid.Column>
            </Grid>
            <Container textAlign="center">
                <Button primary content={get('save')}/>
            </Container>
        </Form>
    );
};

export default NewCategoryForm;
