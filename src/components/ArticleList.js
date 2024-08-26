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

// Article component for every article on the list.
const Article = ({ id, title, createdDate, onArticleDelete }) => {
    return (
        <div className='mb-4'>
            <ul className='flex justify-between text-[#613A28] px-3 py-2 border border-[#613A28] hover:bg-gray-300 transition-colors duration-300 ease-in-out mb-4'>
                <Link to={`/articles/${id}`}>
                    {title}
                    <p className='text-xs text-gray-500'>Created Date: {formatDate(createdDate)}</p>
                </Link>
                <i className='flex items-center cursor-pointer text-red-600'
                    onClick={() => onArticleDelete(id, title)}
                >
                    <IoTrashOutline className="text-xl" />
                </i>
            </ul>
        </div>
    );
};

const ArticleList = () => {
    const { loading, error, data } = useQuery(GET_ALL_ARTICLES_QUERY, {
        fetchPolicy: 'network-only'
    });

    const [deleteArticle] = useMutation(DELETE_ARTICLE);

    // State to handle popup visibility and selected article for deletion
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState({ id: null, title: '' });

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

    // Handle the cancel action, close the popup without deleting
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
        </div>
    );
};

export default ArticleList;