import React, { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_ARTICLE_DETAIL } from '../queries/fetchArticle';
import TextCreate from './TextCreate';
import TextList from './TextList';

const ArticleDetail = () => { 
    const { id } = useParams(); // Extract the article ID from the URL parameters
    const { loading, error, data } = useQuery(GET_ARTICLE_DETAIL, {
        variables: { id },
    });
    const [article, setArticle] = useState({});

    useEffect(() => {
        if (data && data.article) {
            setArticle(data.article);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    console.log(article.texts);

    return (
        <div style={{ padding: "20px 30px" }}>
            <Link to="/" >
                <i className='material-icons'>arrow_back</i>
            </Link>
            <h6>Article ID: 
                <span style={{ color: "gray" }}> {article.id}</span>
            </h6>
            <h5>{article.title}</h5>

            <br />

            <TextCreate />
            <TextList texts={article.texts || []} /> 
        </div>
    );
};

export default ArticleDetail;