import React from 'react';
import * as serviceWorker from './serviceWorker';
import {render} from 'react-dom';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink, split} from '@apollo/client';
import {getMainDefinition} from '@apollo/client/utilities';
import {WebSocketLink} from '@apollo/client/link/ws';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import Routes from './routes';
import {refreshTokens, setAuthHeaders} from './utils/Auth';
import {server} from './config';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import './dark-theme.css';


let apolloClient;

const httpLink = createHttpLink({uri: server.apiHttpEndpoint});

const wsLink = new WebSocketLink({
    uri: `${server.apiWSEndpoint}`,
    options: {
        reconnect: true
    }
});

const setTokensLink = setContext((_, {headers}) => setAuthHeaders(headers));

const errorLink = onError(({networkError, graphQLErrors, operation, forward}) => {
    if (networkError?.result?.errors[0]?.extensions?.code === '401'
        || (graphQLErrors?.length > 0 && graphQLErrors[0]?.extensions?.code === '401')) {
        return refreshTokens(apolloClient, operation, forward);
    }
});

const protocolSplitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
);


apolloClient = new ApolloClient({
    link: ApolloLink.from([setTokensLink, errorLink, protocolSplitLink]),
    cache: new InMemoryCache()
});

const App = () => (
    <ApolloProvider client={apolloClient}>
        <Routes/>
    </ApolloProvider>
);

render(<App/>, document.getElementById('root'));
serviceWorker.unregister();
