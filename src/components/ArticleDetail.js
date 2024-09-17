import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

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
        <div className='px-7 py-5'>
            <div className='bg-white w-fit px-5 py-2 border mb-5 hover:bg-gray-300'>
                <Link to="/">
                    <FaArrowLeftLong />
                </Link>
            </div>
            <h6>Article ID: 
                <span className='text-gray-500 text-sm'> {article.id}</span>
            </h6>
            <h6>Article Title: 
                <span className='mb-5 text-2xl font-semibold'> {article.title}</span>
            </h6>

            <br />

            <TextCreate articleId={id} />
            <TextList texts={article.texts || []} articleId={id} />
        </div>
    );
};

export default ArticleDetail;