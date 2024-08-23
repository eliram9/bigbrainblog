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
    const [errorMessage, setErrorMessage] = useState('');

    const [createArticle, { data, loading, error }] = useMutation(CREATE_NEW_ARTICLE);
    const navigate = useNavigate(); // Use the navigate hook for navigation

    const CreateNewArticle = (evt) => {
        evt.preventDefault();
        
        // Validate the title length
        if (title.length < 2) {
            setErrorMessage('Title must be at least 2 characters long.');
            return; // Stop further execution
        }

        // If validation passes, clear the error message and proceed
        setErrorMessage('');
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
        <div className='px-7 py-5'>
            <div className='bg-white w-fit px-5 py-2 border mb-5 hover:bg-gray-300'>
                <Link to="/">
                    <FaArrowLeftLong />
                </Link>
            </div>
            
            <h5 className='mb-5 text-2xl font-semibold'>Create New Article</h5>
            <form
                  onSubmit={CreateNewArticle}
            >
                <label>Article new article title: </label>
                <input onChange={(evt) => setTitle(evt.target.value)}
                       value={title}
                       className='p-1 w-full mb-5'
                />
                {/* Validation error message */}
                {errorMessage && <p className='text-xs text-red-500'>{errorMessage}</p>}
                <button type="submit"
                        className='bg-[#613A28] text-white w-fit px-5 py-2 border mb-5 hover:bg-gray-500'
                >
                    Submit
                </button>
            </form>
            {loading && <p>Submitting...</p>}
            {error && <p>Error :( Please try again</p>}
            {data && <p style={{ color: "green" }}>Article "{data.addArticle.title}" created successfully!</p>}
        </div>
    )
}

export default ArticleCreate;
