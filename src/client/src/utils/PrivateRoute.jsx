import React from 'react';
import {Route} from 'react-router-dom';
import decode from 'jwt-decode';
import {useQuery} from '@apollo/client';
import userQueries from '../graphql/queries/users';


const PrivateRoute = ({component: Component, ...props}) => {

    const {loading: loadingUser, data: userData, error} = useQuery(userQueries.GET_USER);

    const hasTokens = () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        let authenticated;
        try {
            let decodedAccessToken = decode(accessToken);
            let decodedRefreshToken;
            if (refreshToken) {
                decodedRefreshToken = decode(refreshToken);
            }
            authenticated = decodedAccessToken.exp * 1000 > Date.now()
                || decodedRefreshToken.exp * 1000 > Date.now();
        } catch {
            authenticated = false;
        }
        return authenticated;
    };

    let destination;
    if (!loadingUser && !error && userData?.user && hasTokens()) {
        destination = <Component {...props} />;
    } else {
        destination = null;
    }

    return <Route {...props} render={() => destination}/>
};

export default PrivateRoute;
