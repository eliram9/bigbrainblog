import React from 'react';

import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './components/App';
import ArticleList from './components/ArticleList';
import ArticleCreate from './components/ArticleCreate';
import ArticleDetail from './components/ArticleDetail';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
});

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <div className="bg-[#F6EBDB] text-[#613A28] min-h-screen p-0 m-0">
                <Router>
                    <Routes>
                        {/* Main route with nested routes */}
                        <Route path="/" element={<App />}>
                            {/* Default route, rendered at / */}
                            <Route index element={<ArticleList />} />
                            {/* Additional routes */}
                            <Route path="articles/new" element={<ArticleCreate />} />
                            <Route path="articles/:id" element={<ArticleDetail />} />
                        </Route>
                    </Routes>
                </Router>
            </div>    
        </ApolloProvider>
    );
};

// Create a root container instead of using ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application using the root container
root.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);