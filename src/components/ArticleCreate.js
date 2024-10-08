import React, { useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

import { GET_ALL_ARTICLES_QUERY } from '../queries/fetchAllArticles';
import { CREATE_NEW_ARTICLE } from '../queries/addNewArticle';
import { auth, signInWithGoogle } from '../utils/firebase';

const ArticleCreate = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');  
    const [openingImageUrl, setOpeningImageUrl] = useState('');
    const [summary, setSummary] = useState(''); 
    const [category, setCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [createArticle, { data, loading, error }] = useMutation(CREATE_NEW_ARTICLE);
    const navigate = useNavigate();

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
            return;
        }
        
        // Validate the title length
        if (title.trim().length < 2) {
            setErrorMessage('Title must be at least 2 characters long.');
            return;
        }

        // Validate the summary
        if (summary.trim().length < 3) {
            setErrorMessage('Summary must be at least 3 characters long.');
            return;
        }

        // Validate the category
        if (!category) {
            setErrorMessage('Please select a valid category.');
            return;
        }

        // Update the validation for image URL and Giphy URLs
        if (openingImageUrl.trim() && 
            !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(openingImageUrl.trim()) && 
            !/^https:\/\/media\.giphy\.com\/media\/[a-zA-Z0-9]+\/giphy\.gif(\?.*)?$/.test(openingImageUrl.trim())) {
                setErrorMessage('Please enter a valid image URL (jpg, jpeg, png, webp, avif, gif, svg, or Giphy GIF).');
        return;
}

        // If validation passes, clear the error message and proceed
        setErrorMessage('');
        createArticle({
            variables: {
                title: title.trim(),
                author: author.trim(),
                openingImageUrl: openingImageUrl.trim() || null,
                summary: summary.trim(),
                category
            },
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }]
        }).then(() => {
            setTitle(''); 
            setAuthor(''); 
            setOpeningImageUrl('');
            setSummary('');
            setCategory('');
            navigate('/');
        }).catch((err) => {
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
                    disabled={!isAuthenticated}
                    placeholder="Enter author name"
                />

                {/* Article Title */}
                <label>Article Title: </label>
                <input 
                    onChange={(evt) => setTitle(evt.target.value)}
                    value={title}
                    className='p-1 w-full mb-5'
                    disabled={!isAuthenticated}
                    placeholder="Enter article title"
                />

                {/* Summary */}
                <label>Summary: </label>
                <textarea 
                    onChange={(evt) => setSummary(evt.target.value)}
                    value={summary}
                    className='p-1 w-full mb-5'
                    disabled={!isAuthenticated}
                    placeholder="Enter a brief summary"
                    rows="4"
                ></textarea>

                {/* Category */}
                {/* Category Dropdown */}
                <label>Category: </label>
                <select 
                    onChange={(evt) => setCategory(evt.target.value)}
                    value={category}
                    className='p-1 w-full mb-5'
                    disabled={!isAuthenticated}
                >
                    <option value="">Select a Category</option>
                    <option value="EMDR Therapy General">EMDR Therapy General</option>
                    <option value="EMDR for Trauma and PTSD">EMDR for Trauma and PTSD</option>
                    <option value="EMDR for Anxiety and Stress">EMDR for Anxiety and Stress</option>
                    <option value="EMDR and ADHD">EMDR and ADHD</option>
                    <option value="EMDR Success Stories">EMDR Success Stories</option>
                </select>

                {/* Opening Image URL */}
                <label>Opening Image URL: </label>
                <input 
                    onChange={(evt) => setOpeningImageUrl(evt.target.value)}
                    value={openingImageUrl}
                    className='p-1 w-full mb-5'
                    disabled={!isAuthenticated}
                    placeholder="Enter opening image URL"
                />

                {/* Validation error message */}
                {errorMessage && <p className='text-xs text-red-500'>{errorMessage}</p>}
                <button 
                    type="submit"
                    disabled={!isAuthenticated || loading} // Disable during submission
                    className={`w-fit px-5 py-2 border mb-5 ${isAuthenticated && !loading 
                        ? 'bg-[#613A28] text-white hover:bg-gray-500' 
                        : 'bg-gray-500 text-gray-700 cursor-not-allowed'}`
                    }
                    onClick={(evt) => {
                        if (!isAuthenticated) {
                            evt.preventDefault();
                            signInWithGoogle();
                        }
                    }} 
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {error && <p className='text-xs text-rose-500'>Error :( Please try again</p>}
            {data && <p className='text-emerald-600'>Article "{data.addArticle.title}" created successfully!</p>}
        </div>
    )
}

export default ArticleCreate;