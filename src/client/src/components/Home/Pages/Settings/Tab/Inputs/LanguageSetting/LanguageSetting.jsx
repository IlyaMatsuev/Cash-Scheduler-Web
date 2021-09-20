import React from 'react';
import {useQuery} from '@apollo/client';
import {Dropdown} from 'semantic-ui-react';
import settingQueries from '../../../../../../../graphql/queries/settings';
import {convertToValidIconUrl} from '../../../../../../../utils/GlobalUtils';
import {get} from '../../../../../../../utils/TranslationUtils';


const LanguageSetting = ({setting, onChange}) => {
    const {
        data: languagesQueryData,
        loading: languagesQueryLoading,
        error: languagesQueryError
    } = useQuery(settingQueries.GET_AVAILABLE_LANGUAGES);

    return (
        <Dropdown placeholder={get('pickLanguage', 'settings')}
                  search selection
                  name={setting.setting.name} value={setting.value}
                  onChange={onChange}
                  loading={languagesQueryLoading || !!languagesQueryError}
                  options={languagesQueryData?.languages?.map(lang => ({
                      key: lang.abbreviation,
                      value: lang.abbreviation,
                      text: lang.name,
                      image: {src: convertToValidIconUrl(lang.iconUrl)}
                  })) || []}
        />
    );
};

export default LanguageSetting;
