import React from 'react';
import HomeWrapper from '../components/Home/HomeWrapper/HomeWrapper';
import {useQuery} from '@apollo/client';
import settingQueries from '../graphql/queries/settings';
import {getSetting} from '../utils/SettingUtils';
import {setTheme} from '../utils/GlobalUtils';
import {setLang} from '../utils/TranslationUtils';


const Home = () => {
    const {data: settingsQueryData} = useQuery(settingQueries.GET_SETTINGS, {
        variables: {unitName: 'General'}
    });

    setTheme(getSetting('DarkTheme', settingsQueryData) ? 'dark' : 'light');
    setLang(getSetting('Language', settingsQueryData, false));

    return <HomeWrapper/>;
};

export default Home;
