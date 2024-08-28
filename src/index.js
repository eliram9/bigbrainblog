import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, from, HttpLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './components/App';
import ArticleList from './components/ArticleList';
import ArticleCreate from './components/ArticleCreate';
import ArticleDetail from './components/ArticleDetail';
import { AuthProvider } from './utils/firebase'; // Import AuthProvider

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <AuthProvider> {/* Wrap the entire app with AuthProvider */}
                <div className="bg-[#F6EBDB] text-[#613A28] min-h-screen p-0 m-0">
                    <Router>
                        <Routes>
                            <Route path="/" element={<App />}>
                                <Route index element={<ArticleList />} />
                                <Route path="articles/new" element={<ArticleCreate />} />
                                <Route path="articles/:id" element={<ArticleDetail />} />
                            </Route>
                        </Routes>
                    </Router>
                </div>
            </AuthProvider>
        </ApolloProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);