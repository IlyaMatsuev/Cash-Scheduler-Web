import React from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import {get} from '../../../../utils/TranslationUtils';


const MenuItem = ({name, iconName, onMenuItemSelected}) => {
    return (
        <Menu.Item as="a" className="text-center text-capitalize" name={name} onClick={onMenuItemSelected}>
            {get(name, 'menu')}
            <Icon name={iconName}/>
        </Menu.Item>
    );
};

export default MenuItem;
