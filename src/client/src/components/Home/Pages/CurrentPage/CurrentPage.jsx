import React from 'react';
import {useTransition, animated} from 'react-spring';
import Dashboard from '../Dashboard/Dashboard';
import Transactions from '../Transactions/Transactions';
import Categories from '../Categories/Categories';
import Settings from '../Settings/Settings';
import Wallets from '../Wallets/Wallets';


const CurrentPage = ({index, transactionsProps, onTransactionPropsChange, categoriesProps, onCategoryPropsChange}) => {

    const pages = [
        <Dashboard currentDate={transactionsProps.currentDate}
                   onTransactionPropsChange={onTransactionPropsChange}
        />,
        <Wallets/>,
        <Transactions currentDate={transactionsProps.currentDate}
                      isRecurringView={transactionsProps.isRecurringView}
                      onTransactionPropsChange={onTransactionPropsChange}
        />,
        <Categories activeCategoryTabIndex={categoriesProps.activeCategoryTabIndex}
                    onCategoryPropsChange={onCategoryPropsChange}
        />,
        <Settings/>
    ];

    const pagesTransitions = useTransition(index, k => k, {
        from: {opacity: 0, transform: 'translate3d(0,100%,0)', position: 'absolute'},
        enter: {opacity: 1, transform: 'translate3d(0,0%,0)', position: 'relative'},
        leave: {opacity: 0, transform: 'translate3d(0,-100%,0)', position: 'absolute'},
        config: {duration: 300}
    });

    return pagesTransitions.map(({item: pageIndex, props, key}) => {
        const Page = () => pages[pageIndex];
        return (
            <animated.div key={key} style={props} className="fullHeight">
                <Page/>
            </animated.div>
        );
    });
};

export default CurrentPage;
