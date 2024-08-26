import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { IoTrashOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_ARTICLES_QUERY } from '../queries/fetchAllArticles';
import { formatDate } from '../utils/formatDate';

const DELETE_ARTICLE = gql`
    mutation DeleteArticle($id: ID!) {
        deleteArticle(id: $id) {
            id
            title
            createdDate
        }
    }
`;

// Article components for every article on the list.
const Article = ({ id, title, createdDate, onArticleDelete }) => {
    
    return (
        <div className='mb-4'>
            <ul className='flex justify-between text-[#613A28] px-3 py-2 border border-[#613A28] hover:bg-gray-300 transition-colors duration-300 ease-in-out mb-4'>
                <Link to={`/articles/${id}`}>
                    {title}
                    <p className='text-xs text-gray-500'>Created Date: {formatDate(createdDate)}</p>
                </Link>
                <i className='flex items-center cursor-pointer text-red-600'
                    onClick={() => onArticleDelete(id)} // Attach the delete function to the onClick event
                >
                    <IoTrashOutline className="text-xl" />
                </i>
            </ul>
        </div>
    );
};

const ArticleList = () => {
    const { loading, error, data } = useQuery(GET_ALL_ARTICLES_QUERY, {
        fetchPolicy: 'network-only' // Ensure that the data is always fetched from the network
    });

    const [deleteArticle] = useMutation(DELETE_ARTICLE);

    // State to handle popup visibility and selected article ID for deletion
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);

    // Show the popup and set the article ID to be deleted
    const onArticleDeleteClick = (id) => {
        setSelectedArticleId(id);
        setIsPopupVisible(true);
    };

    // Handle the article deletion and close the popup
    const handleDelete = () => {
        deleteArticle({
            variables: { id: selectedArticleId },
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }]
        }).then(() => {
            setIsPopupVisible(false);
            setSelectedArticleId(null);
        }).catch(error => {
            console.error('Error deleting article:', error);
            // Handle the error appropriately, e.g., show an error message to the user
            setIsPopupVisible(false);
            setSelectedArticleId(null);
        });
    };

    // Handle the cancel action, close the popup without deleting
    const handleCancel = () => {
        setIsPopupVisible(false);
        setSelectedArticleId(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className='p-4'>
            <h5 className='mb-5 text-2xl font-semibold'>Article List</h5>
            {data.articles.map((article) => ( // Pass each article object instead of individual properties
                <Article key={article.id} 
                         id={article.id} 
                         title={article.title} 
                         createdDate={article.createdDate}
                         onArticleDelete={onArticleDeleteClick} 
                />
            ))}

            {/*  Add button to add a new article */}
            <div className="flex justify-end mt-4">
                <Link to="/articles/new"
                      className="bg-green-800 text-white p-3 rounded-full hover:bg-green-900"
                >
                    <IoMdAdd className="text-2xl" />
                </Link>
            </div>

            {/* Popup confirmation dialog for deleting an article */}
            {isPopupVisible && (
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 z-50'>
                    <p>Are you sure you want to delete this article?</p>
                    <button onClick={handleDelete} style={{ marginRight: '10px', border: "1px solid red", color: "red" }}>Yes!</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ArticleList;