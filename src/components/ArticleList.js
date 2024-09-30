import React, { useState, useEffect } from 'react';

import { IoMdAdd } from "react-icons/io";
import { useQuery, useMutation } from '@apollo/client';

import { GET_ALL_ARTICLES_QUERY } from '../queries/fetchAllArticles';
import { UPDATE_ARTICLE_TITLE } from '../queries/updateArticleTitle';
import { DELETE_ARTICLE } from '../queries/deleteArticle';
import { auth, signInWithGoogle } from '../utils/firebase'; 
import Article from './Article';

const ArticleList = () => {
    const { loading, error, data } = useQuery(GET_ALL_ARTICLES_QUERY, {
        fetchPolicy: 'network-only'
    });

    const [updateArticleTitle] = useMutation(UPDATE_ARTICLE_TITLE);
    const [deleteArticle] = useMutation(DELETE_ARTICLE);

    // State to track user authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // State to handle popup visibility and selected article for deletion or editing
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState({ id: null, title: '', summary: '' });
    const [editTitle, setEditTitle] = useState('');
    const [editSummary, setEditSummary] = useState(''); // New state for summary

    // Track authentication state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    // Handle the title and summary edit
    const onTitleEdit = (id, currentTitle, currentSummary) => {
        setSelectedArticle({ id, title: currentTitle, summary: currentSummary });
        setEditTitle(currentTitle);
        setEditSummary(currentSummary);
        setIsEditPopupVisible(true);
    };

    const handleEditSave = () => {
        updateArticleTitle({
            variables: { id: selectedArticle.id, title: editTitle, summary: editSummary }, // Include summary
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }]
        }).then(() => {
            setIsEditPopupVisible(false);
            setSelectedArticle({ id: null, title: '', summary: '' });
            setEditTitle('');
            setEditSummary('');
        }).catch(error => {
            console.error('Error updating article:', error);
        });
    };

    const handleEditCancel = () => {
        setIsEditPopupVisible(false);
        setSelectedArticle({ id: null, title: '', summary: '' });
        setEditTitle('');
        setEditSummary('');
    };

    // Show the popup and set the article to be deleted
    const onArticleDeleteClick = (id, title) => {
        setSelectedArticle({ id, title });
        setIsPopupVisible(true);
    };

    // Handle the article deletion and close the popup
    const handleDelete = () => {
        deleteArticle({
            variables: { id: selectedArticle.id },
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }]
        }).then(() => {
            setIsPopupVisible(false);
            setSelectedArticle({ id: null, title: '' });
        }).catch(error => {
            console.error('Error deleting article:', error);
            setIsPopupVisible(false);
            setSelectedArticle({ id: null, title: '' });
        });
    };

    const handleCancel = () => {
        setIsPopupVisible(false);
        setSelectedArticle({ id: null, title: '' });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className='p-4'>
            <h5 className='mb-5 text-2xl font-semibold'>Article List</h5>
            {data.articles.map((article) => (
                <Article key={article.id} 
                         id={article.id} 
                         title={article.title}
                         author={article.author} 
                         summary={article.summary}
                         createdDate={article.createdDate}
                         onTitleEdit={() => onTitleEdit(article.id, article.title, article.summary)}
                         onArticleDelete={onArticleDeleteClick}
                         isAuthenticated={isAuthenticated}
                />
            ))}

            {/* Add button to add a new article */}
            <div className="flex justify-end mt-4">
                <button
                    className={`p-3 rounded-full ${
                        isAuthenticated ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                    onClick={(evt) => {
                        if (!isAuthenticated) {
                            evt.preventDefault(); // Prevents navigation
                            signInWithGoogle(); // Opens the Google login
                        } else {
                            window.location.href = "/articles/new"; // Redirects to the new article page if authenticated
                        }
                    }}
                >
                    <IoMdAdd className="text-2xl" />
                </button>
            </div>

            {/* Popup confirmation dialog for deleting an article */}
            {isPopupVisible && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className='fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 z-50 shadow-lg'>
                        <p className='mb-4'>Are you sure you want to delete this article?</p>
                        <p className='mb-5 italic'>&quot;{selectedArticle.title}&quot;</p>
                        <button onClick={handleDelete} 
                                className='mr-3 border-red-500 border text-red-500 py-1 px-3 hover:bg-red-100 transition-colors duration-200'
                        >
                            Yes!
                        </button>
                        <button onClick={handleCancel}
                                className='bg-[#613A28] text-white py-1 px-3 hover:bg-[#573424] transition-colors duration-200'
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {/* Popup for editing the title and summary */}
            {isEditPopupVisible && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="w-1/2 fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 z-50 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold">Edit Article Title and Summary</h3>

                        {/* Input field for editing the title */}
                        <div>
                            Title:
                            <input type="text"
                                   value={editTitle}
                                   onChange={(evt) => setEditTitle(evt.target.value)}
                                   className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                        </div>

                        {/* Text area for editing the article summary */}
                        <div className='mt-6'>
                            Summary:
                            <textarea value={editSummary}
                                      onChange={(evt) => setEditSummary(evt.target.value)}
                                      className="w-full p-2 mb-4 border border-gray-300 rounded"
                                      rows="5" 
                            />
                        </div>

                        {/* Save button */}
                        <button
                            onClick={handleEditSave}
                            className="mr-3 bg-[#613A28] text-white py-1 px-3 hover:bg-[#573424] transition-colors duration-200"
                        >
                            Save
                        </button>

                        {/* Cancel button */}
                        <button
                            onClick={handleEditCancel}
                            className="border-[#613A28] border text-[#613A28] py-1 px-3 hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ArticleList;