import React, { useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { useQuery, useMutation } from '@apollo/client';

import { GET_ALL_ARTICLES_QUERY } from '../queries/fetchAllArticles';
import { UPDATE_ARTICLE_TITLE } from '../queries/updateArticleTitle';
import { DELETE_ARTICLE } from '../queries/deleteArticle';
import { auth, signInWithGoogle } from '../utils/firebase';
import Article from './Article';
import ArticleTitlesEdit from './ArticleTitlesEdit'; 

const ArticleList = () => {
    const { loading, error, data } = useQuery(GET_ALL_ARTICLES_QUERY, { fetchPolicy: 'network-only' });
    const [updateArticleTitle] = useMutation(UPDATE_ARTICLE_TITLE);
    const [deleteArticle] = useMutation(DELETE_ARTICLE);

    // State to track user authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null); // Updated for full article

    // Track authentication state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    // Handle the title and summary edit
    const onTitleEdit = (article) => {
        setSelectedArticle(article);
        setIsEditPopupVisible(true);
    };

    const handleEditSave = (updatedArticle) => {
        updateArticleTitle({
            variables: {
                id: updatedArticle.id,
                title: updatedArticle.title,
                author: updatedArticle.author,
                category: updatedArticle.category,
                openingImageUrl: updatedArticle.openingImageUrl,
                summary: updatedArticle.summary
            },
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }]
        })
        .then(() => {
            setIsEditPopupVisible(false);
            setSelectedArticle(null);
        })
        .catch(error => {
            console.error('Error updating article:', error);
        });
    };

    const handleEditCancel = () => {
        setIsEditPopupVisible(false);
        setSelectedArticle(null);
    };

    // Show the popup and set the article to be deleted
    const onArticleDeleteClick = (id, title) => {
        setSelectedArticle({ id, title });
        setIsPopupVisible(true);
    };

    const handleDelete = () => {
        deleteArticle({
            variables: { id: selectedArticle.id },
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }]
        }).then(() => {
            setIsPopupVisible(false);
            setSelectedArticle(null);
        }).catch(error => {
            console.error('Error deleting article:', error);
            setIsPopupVisible(false);
            setSelectedArticle(null);
        });
    };

    const handleCancel = () => {
        setIsPopupVisible(false);
        setSelectedArticle(null);
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
                         onTitleEdit={() => onTitleEdit(article)}  // Pass the full article object
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
                            evt.preventDefault();
                            signInWithGoogle();
                        } else {
                            window.location.href = "/articles/new";
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

            {/* Render the ArticleTitlesEdit component */}
            {isEditPopupVisible && selectedArticle && (
                <ArticleTitlesEdit
                    article={selectedArticle}
                    onSave={handleEditSave}
                    onClose={handleEditCancel}
                />
            )}
        </div>
    );
};

export default ArticleList;