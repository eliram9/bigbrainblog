import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { IoTrashOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_ARTICLES_QUERY } from '../queries/fetchAllArticles';

const DELETE_ARTICLE = gql`
    mutation DeleteArticle($id: ID!) {
        deleteArticle(id: $id) {
            id
        }
    }
`;

// Article components for every article on the list.
const Article = ({ id, title, onArticleDelete }) => {
    const [isHovered, setIsHovered] = useState(false);

    const style = {
        color: "#613A28",
        padding: "8px 10px",
        border: "1px solid #613A28",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: isHovered ? "lightGray" : "transparent", // Change background on hover
        transition: "background-color 0.3s ease" // Smooth transition effect
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div>
            <ul style={style}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link to={`/articles/${id}`}>
                    {title}
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
            refetchQueries: [{ query: GET_ALL_ARTICLES_QUERY }] // Refetch the articles query after deletion
        }).then(() => {
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
        <div style={{ padding: "20px 30px" }}>
            <h5>Article List</h5>
            {data.articles.map((article) => ( // Pass each article object instead of individual properties
                <Article key={article.id} 
                         id={article.id} 
                         title={article.title} 
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
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    padding: '20px', backgroundColor: 'white', border: '1px solid gray', zIndex: 1000
                }}>
                    <p>Are you sure you want to delete this article?</p>
                    <button onClick={handleDelete} style={{ marginRight: '10px', border: "1px solid red", color: "red" }}>Yes!</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ArticleList;