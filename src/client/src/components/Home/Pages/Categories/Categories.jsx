import React, {useState} from 'react';
import {Button, Container, Grid, Modal, Segment, Tab, Dimmer, Loader, Confirm} from 'semantic-ui-react';
import NewCategoryForm from './NewCategory/NewCategoryForm';
import {useMutation, useQuery} from '@apollo/client';
import {onUIErrors} from '../../../../utils/GlobalUtils';
import {createEntityCache, updateEntityCache, removeEntityCache} from '../../../../utils/CacheUtils';
import {get} from '../../../../utils/TranslationUtils';
import CategoriesList from './CategoriesList/CategoriesList';
import EditCategoryForm from './EditCategory/EditCategoryForm';
import styles from './Categories.module.css';
import userQueries from '../../../../graphql/queries/users';
import walletQueries from '../../../../graphql/queries/wallets';
import categoryQueries from '../../../../graphql/queries/categories';
import transactionQueries from '../../../../graphql/queries/transactions';
import categoryMutations from '../../../../graphql/mutations/categories';
import categoryFragments from '../../../../graphql/fragments/categories';


const Categories = ({activeCategoryTabIndex, onCategoryPropsChange}) => {
    const initialState = {
        categoryEditModalOpen: false,
        categoryDeleteConfirmationOpen: false,
        newCategory: {
            name: '',
            transactionTypeName: 'Expense',
            iconUrl: ''
        },
        category: {
            name: '',
            transactionTypeName: '',
            iconUrl: ''
        }
    };
    const [state, setState] = useState(initialState);

    const errorsInitialState = {};
    const [errors, setErrors] = useState(errorsInitialState);

    const categoryWithTypesQuery = useQuery(categoryQueries.GET_CATEGORIES_WITH_TYPES);

    const [createCategory, {loading: createCategoryLoading}] = useMutation(categoryMutations.CREATE_CATEGORY, {
        onCompleted: () => setState(initialState),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                const createdCategory = result.data.createCategory;
                createEntityCache(
                    cache,
                    createdCategory,
                    ['customCategories', 'allCategories'],
                    categoryFragments.NEW_CATEGORY
                );
            }
        },
        variables: {category: state.newCategory}
    });

    const [updateCategory, {loading: updateCategoryLoading}] = useMutation(categoryMutations.UPDATE_CATEGORY, {
        onCompleted: () => setState(initialState),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                const updatedCategory = result.data.updateCategory;
                updateEntityCache(
                    cache,
                    updatedCategory,
                    categoryFragments.NEW_CATEGORY,
                    {
                        name: updatedCategory.name,
                        iconUrl: updatedCategory.iconUrl
                    }
                );
            }
        },
        variables: {
            category: {
                id: state.category.id,
                name: state.category.name,
                iconUrl: state.category.iconUrl
            }
        }
    });

    const [deleteCategory, {loading: deleteCategoryLoading}] = useMutation(categoryMutations.DELETE_CATEGORY, {
        onCompleted: () => setState(initialState),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                removeEntityCache(
                    cache,
                    result.data.deleteCategory,
                    ['customCategories', 'allCategories']
                );
            }
        },
        variables: {id: state.category.id},
        refetchQueries: [
            {query: userQueries.GET_USER_WITH_BALANCE},
            {query: walletQueries.GET_WALLETS},
            transactionQueries.GET_DASHBOARD_TRANSACTIONS_QUERY,
            transactionQueries.GET_TRANSACTIONS_BY_MONTH_QUERY
        ]
    });


    const onNewCategoryCreate = event => {
        event.preventDefault();
        setErrors(errorsInitialState);
        createCategory();
    };

    const onNewCategoryChange = (event, {name, value}) => {
        setState({...state, newCategory: {...state.newCategory, [name]: value}});
        setErrors({...errors, [name]: undefined});
    };

    const onCategoryEditToggle = category => {
        if (!state.categoryEditModalOpen && category) {
            state.category = category;
        }

        setErrors(errorsInitialState);
        setState({...state, categoryEditModalOpen: !state.categoryEditModalOpen});
    };

    const onCategoryEditSave = () => {
        setErrors(errorsInitialState);
        updateCategory();
    };

    const onCategoryEditChange = (event, {name, value}) => {
        setState({...state, category: {...state.category, [name]: value}});
        setErrors({...errors, [name]: undefined});
    };

    const onCategoryEditDelete = () => {
        setErrors(errorsInitialState);
        deleteCategory();
    };

    const onCategoryDeleteConfirmationToggle = () => {
        setState({...state, categoryDeleteConfirmationOpen: !state.categoryDeleteConfirmationOpen});
    };


    const standardCategoriesTab = <CategoriesList query={categoryWithTypesQuery} categoryType="standardCategories"
                                                  onCategoryClick={onCategoryEditToggle}/>;
    const customCategoriesTab = <CategoriesList query={categoryWithTypesQuery} categoryType="customCategories"
                                                onCategoryClick={onCategoryEditToggle}/>;

    const panels = [
        {menuItem: get('standardCategories', 'categories'), render: () => <Tab.Pane>{standardCategoriesTab}</Tab.Pane>},
        {menuItem: get('customCategories', 'categories'), render: () => <Tab.Pane>{customCategoriesTab}</Tab.Pane>}
    ];

    const onCategoryTabChange = (event, {activeIndex}) => {
        onCategoryPropsChange({name: 'activeCategoryTabIndex', value: activeIndex});
    };

    return (
        <Container fluid>
            <Grid padded columns={2}>
                <Grid.Column width={12}>
                    <Tab menu={{fluid: true, vertical: true, tabular: true}}
                         panes={panels} activeIndex={activeCategoryTabIndex}
                         onTabChange={onCategoryTabChange}
                    />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Segment loading={createCategoryLoading}>
                        <NewCategoryForm category={state.newCategory} errors={errors}
                                         query={categoryWithTypesQuery}
                                         onCategoryChange={onNewCategoryChange}
                                         onCategoryCreate={onNewCategoryCreate}/>
                    </Segment>
                </Grid.Column>
            </Grid>

            <div>
                <Modal dimmer size="small" className="modalContainer"
                       closeOnEscape={true} closeOnDimmerClick={true}
                       open={state.categoryEditModalOpen} onClose={onCategoryEditToggle}>
                    <Modal.Header content={get('editCategory', 'categories')}/>
                    <Modal.Content>
                        <Dimmer active={updateCategoryLoading || deleteCategoryLoading} inverted
                                className={styles.categoryModalLoader}>
                            <Loader/>
                        </Dimmer>
                        <EditCategoryForm category={state.category} errors={errors}
                                          query={categoryWithTypesQuery}
                                          onChange={onCategoryEditChange}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color="grey" onClick={onCategoryEditToggle}
                                content={get('cancel')}
                        />
                        <Button basic color="red"
                                disabled={state.category && !state.category.isCustom}
                                onClick={onCategoryDeleteConfirmationToggle}
                                content={get('delete')}
                        />
                        <Button primary loading={false}
                                disabled={state.category && !state.category.isCustom}
                                onClick={onCategoryEditSave}
                                content={get('save')}
                        />
                    </Modal.Actions>

                    <Confirm className="modalContainer"
                             content={get('deleteConfirmMessage', 'categories')}
                             cancelButton={<Button basic content={get('cancel')}/>}
                             confirmButton={<Button basic negative content={get('confirmDelete')}/>}
                             open={state.categoryDeleteConfirmationOpen}
                             onCancel={onCategoryDeleteConfirmationToggle} onConfirm={onCategoryEditDelete}
                    />
                </Modal>
            </div>
        </Container>
    );
};

export default Categories;
