import React, {useState} from 'react';
import {Menu, Segment, Sidebar} from 'semantic-ui-react';
import Header from '../Header/Header';
import CurrentPage from '../Pages/CurrentPage/CurrentPage';
import moment from 'moment';
import styles from './HomeWrapper.module.css';
import MenuItem from './MenuItem/MenuItem';
import {pages} from '../../../config';


const pagesConfiguration = {
    [pages.names.dashboard]: {iconName: 'calendar check outline'},
    [pages.names.wallets]: {iconName: 'briefcase'},
    [pages.names.transactions]: {iconName: 'money bill alternate outline'},
    [pages.names.categories]: {iconName: 'th'},
    [pages.names.settings]: {iconName: 'setting'}
};

const HomeWrapper = () => {
    const initialState = {
        visible: false,
        pageIndex: 0,
        transactions: {
            currentDate: moment(),
            isRecurringView: false
        },
        categories: {
            activeCategoryTabIndex: 0
        }
    };
    const [state, setState] = useState(initialState);


    const onSectionClick = sectionName => {
        const newPageIndex = Object.keys(pagesConfiguration).indexOf(sectionName);
        if (state.pageIndex !== newPageIndex) {
            setState({...state, pageIndex: newPageIndex});
        }
    };

    const onToggleMenu = () => setState({...state, visible: !state.visible});

    const onHideMenu = () => setState({...state, visible: false});

    const onMenuItemSelected = (event, data) => {
        setState({...state, visible: false, pageIndex: Object.keys(pagesConfiguration).indexOf(data.name)});
    };

    const onTransactionPropsChange = ({name, value}) => {
        setState({...state, transactions: {...state.transactions, [name]: value}});
    };

    const onCategoryPropsChange = ({name, value}) => {
        setState({...state, categories: {...state.categories, [name]: value}});
    };


    return (
        <Sidebar.Pushable as={Segment} className={styles.sidebar}>
            <Sidebar as={Menu} animation="slide along" inverted width="wide" vertical dimmed="true"
                     visible={state.visible} onHide={onHideMenu}>
                {
                    Object.keys(pagesConfiguration).map(page => (
                        <MenuItem key={page} name={page}
                                  iconName={pagesConfiguration[page].iconName}
                                  onMenuItemSelected={onMenuItemSelected}/>
                    ))
                }
            </Sidebar>

            <Sidebar.Pusher dimmed={state.visible} className="fullHeight">
                <Segment basic className="fullHeight p-0">
                    <Header onToggleMenu={onToggleMenu} onSectionClick={onSectionClick}/>
                    <CurrentPage index={state.pageIndex}
                                 transactionsProps={state.transactions}
                                 onTransactionPropsChange={onTransactionPropsChange}
                                 categoriesProps={state.categories}
                                 onCategoryPropsChange={onCategoryPropsChange}
                    />
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
};

export default HomeWrapper;
