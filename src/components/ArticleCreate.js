import gql from 'graphql-tag';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

import { GET_ALL_ARTICLES_QUERY } from '../queries/fetchAllArticles';
import { auth, signInWithGoogle } from '../utils/firebase';

const CREATE_NEW_ARTICLE = gql`
    mutation CreateArticle($title: String, $author: String, $openingImageUrl: String) {
        addArticle(title: $title, author: $author, openingImageUrl: $openingImageUrl) {
            id
            title
            author
            openingImageUrl
            createdDate
        }
    }
`;

const ArticleCreate = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');  
    const [openingImageUrl, setOpeningImageUrl] = useState(''); // New state for openingImageUrl
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [createArticle, { data, loading, error }] = useMutation(CREATE_NEW_ARTICLE);
    const navigate = useNavigate(); // Use the navigate hook for navigation

    // Track authentication state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    const CreateNewArticle = (evt) => {
        evt.preventDefault();

        // Validate the author field
        if (author.trim().length < 2) {
            setErrorMessage('Author name must be at least 2 characters long.');
            return; // Stop further execution
        }
        
        // Validate the title length
        if (title.trim().length < 2) {
            setErrorMessage('Title must be at least 2 characters long.');
            return; // Stop further execution
        }

        // Validate the openingImageUrl if provided
        if (openingImageUrl.trim() && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(openingImageUrl.trim())) {
            setErrorMessage('Please enter a valid image URL (jpg, jpeg, png, webp, avif, gif, svg).');
            return; // Stop further execution
        }

        // If validation passes, clear the error message and proceed
        setErrorMessage('');
        createArticle({
            variables: {
                title: title.trim(),
                author: author.trim(),
                openingImageUrl: openingImageUrl.trim() || null // Send null if no URL provided
            },
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }] // Refetch the articles query
            // Right after submission, clean the input and navigate to "/" (ArticleList)     
        }).then(() => {
            setTitle(''); 
            setAuthor(''); 
            setOpeningImageUrl(''); // Clear the openingImageUrl input after submission
            navigate('/');
        }).catch((err) => {
            // Handle any errors that occur during mutation
            setErrorMessage('An error occurred while creating the article. Please try again.');
            console.error(err);
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
            <form onSubmit={CreateNewArticle}>
                {/* Author */}
                <label>Author: </label>
                <input 
                    onChange={(evt) => setAuthor(evt.target.value)}
                    value={author}
                    className='p-1 w-full mb-5'
                    disabled={!isAuthenticated} // Disable input if not authenticated
                    placeholder="Enter author name"
                />

                {/* Article Title */}
                <label>Article Title: </label>
                <input 
                    onChange={(evt) => setTitle(evt.target.value)}
                    value={title}
                    className='p-1 w-full mb-5'
                    disabled={!isAuthenticated} // Disable input if not authenticated
                    placeholder="Enter article title"
                />

                {/* Opening Image URL */}
                <label>Opening Image URL: </label>
                <input 
                    onChange={(evt) => setOpeningImageUrl(evt.target.value)}
                    value={openingImageUrl}
                    className='p-1 w-full mb-5'
                    disabled={!isAuthenticated} // Disable input if not authenticated
                    placeholder="Enter opening image URL (optional)"
                />

                {/* Validation error message */}
                {errorMessage && <p className='text-xs text-red-500'>{errorMessage}</p>}
                <button 
                    type="submit"
                    disabled={!isAuthenticated} // Disable button if not authenticated
                    className={`w-fit px-5 py-2 border mb-5 ${isAuthenticated 
                        ? 'bg-[#613A28] text-white hover:bg-gray-500' 
                        : 'bg-gray-500 text-gray-700 cursor-not-allowed'}`
                    }
                    onClick={(evt) => {
                        if (!isAuthenticated) {
                            evt.preventDefault(); // Prevents form submission
                            signInWithGoogle(); // Opens the Google login
                        }
                    }} 
                >
                    Submit
                </button>
            </form>
            {loading && <p>Submitting...</p>}
            {error && <p className='text-xs text-red-500'>Error :( Please try again</p>}
            {data && <p className='text-green-600'>Article "{data.addArticle.title}" created successfully!</p>}
        </div>
    )
}

export default ArticleCreate;