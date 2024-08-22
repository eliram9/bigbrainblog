import React, { useState } from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";


import { GET_ALL_ARTICLES_QUERY } from '../queries/fetchAllArticles';


const CREATE_NEW_ARTICLE = gql`
    mutation CreateArticle($title: String) {
        addArticle(title: $title) {
            id
            title
        }
    }
`;

const ArticleCreate = () => {
    const [title, setTitle] = useState('');
    const [createArticle, { data, loading, error }] = useMutation(CREATE_NEW_ARTICLE);
    const navigate = useNavigate(); // Use the navigate hook for navigation

    const CreateNewArticle = (evt) => {
        evt.preventDefault();
        createArticle({
            variables: {
                title: title
            },
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }] // Refetch the articles query
        // Right after submission, clean the input and navigate to "/" (ArticleList)     
        }).then(() => {
            setTitle(''); 
            navigate('/');
        });
    };

    return (
        <div style={{ padding: "20px 30px" }}>
            <Link to="/">
                <FaArrowLeftLong />
            </Link>
            <h5>Create New Article</h5>
            <form style={{ padding: "8px 10px" }}
                  onSubmit={CreateNewArticle}
            >
                <label>Article title:</label>
                <input onChange={(evt) => setTitle(evt.target.value)}
                       value={title}
                />
                <button type="submit">Submit</button>
            </form>
            {loading && <p>Submitting...</p>}
            {error && <p>Error :( Please try again</p>}
            {data && <p style={{ color: "green" }}>Article "{data.addArticle.title}" created successfully!</p>}
        </div>
    )
}

export default ArticleCreate;
