import React from 'react';
import {Dropdown, Grid, Input} from 'semantic-ui-react';
import ErrorsList from '../../../../../utils/ErrorsList';
import {server} from '../../../../../config';
import {get} from '../../../../../utils/TranslationUtils';


const EditCategoryForm = ({category, query, errors, onChange}) => {
    return (
        <Grid padded centered>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Input type="text" name="name"
                           placeholder={get('categoryName', 'categories')}
                           disabled={!category.isCustom}
                           error={!!errors.name} value={category.name}
                           onChange={onChange}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Dropdown disabled fluid name="transactionTypeName" selection
                              placeholder={get('categoryType', 'categories')}
                              loading={query.loading || !!query.error}
                              error={!!errors.transactionTypeName} value={category.type.name}
                              options={
                                  (query && query.data && query.data.transactionTypes.map(type => ({
                                      key: type.name,
                                      value: type.name,
                                      text: get(type.name, 'transactionTypes'),
                                      image: {src: `${server.root}${type.iconUrl}`}
                                  }))) || []
                              }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Input fluid name="iconUrl" type="text"
                           placeholder={get('categoryIconUrl', 'categories')}
                           disabled={!category.isCustom}
                           error={!!errors.iconUrl} value={category.iconUrl}
                           onChange={onChange}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    );
};

export default EditCategoryForm;
