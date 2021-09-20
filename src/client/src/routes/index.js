import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import PrivateRoute from '../utils/PrivateRoute';
import Login from './Login';
import Home from './Home';


const Routers = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Login}/>
            <PrivateRoute path="/home" exact component={Home}/>
        </Switch>
    </BrowserRouter>
);

export default Routers;
