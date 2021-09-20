import React from 'react';
import {Message} from 'semantic-ui-react';

const ErrorsList = ({errors}) => {
    if (!errors || Object.keys(errors).length === 0) {
        return null;
    }

    const errorsValues = Object.values(errors);
    return errorsValues.filter((value, i) => value && errorsValues.indexOf(value) === i)
        .map(value => (<Message key={value} error content={value}/>));
};

export default ErrorsList;
