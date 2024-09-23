// TextList.js
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { IoTrashOutline } from "react-icons/io5";
import { LuFileEdit } from "react-icons/lu";

import { auth } from '../utils/firebase'; 
import { DELETE_PARAGRAPH } from '../queries/deleteParagraph';
import { UPDATE_PARAGRAPH } from '../queries/updateParagraph'; 
import { GET_ARTICLE_DETAIL } from '../queries/fetchArticle';
import { getMediaType, getYouTubeID, getVimeoID } from '../utils/mediaUtils';

// Item Component to display each paragraph or media
const Item = ({ paragraph, isAuthenticated, onDelete, onEdit }) => {
    const mediaType = getMediaType(paragraph);
    
    return (
        <div className='flex py-3 px-4 border border-green-700 mb-5 overflow-auto hover:bg-gray-300'>
            <div className='flex-grow mr-3'>
                {mediaType === 'image' && <img src={paragraph} alt="User provided" className='max-w-full h-auto' />}
                {mediaType === 'gif' && <img src={paragraph} alt="GIF" className='max-w-full h-auto' />}
                {mediaType === 'video' && 
                    <video controls className='max-w-full h-auto'>
                        <source src={paragraph} type={`video/${paragraph.substring(paragraph.lastIndexOf('.') + 1)}`} />
                        Your browser does not support the video tag.
                    </video>
                }
                {mediaType === 'audio' && 
                    <audio controls className='w-full'>
                        <source src={paragraph} type={`audio/${paragraph.substring(paragraph.lastIndexOf('.') + 1)}`} />
                        Your browser does not support the audio element.
                    </audio>
                }
                {mediaType === 'youtube' && 
                    <iframe 
                        width="560" 
                        height="315" 
                        src={`https://www.youtube.com/embed/${getYouTubeID(paragraph)}`}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                }
                {mediaType === 'vimeo' && 
                    <iframe 
                        src={`https://player.vimeo.com/video/${getVimeoID(paragraph)}`} 
                        width="640" 
                        height="360" 
                        frameBorder="0" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowFullScreen
                        title="Vimeo video player"
                    ></iframe>
                }
                {mediaType === 'text' && <p>{paragraph}</p>}
            </div>
            
            <div className='flex items-center space-x-3'>
                <div className={`flex items-center ${isAuthenticated ? 'cursor-pointer text-[#613A28]' : 'cursor-not-allowed text-gray-400'}`}
                     onClick={onEdit}
                >
                    <LuFileEdit />
                </div>

                <div className={`flex items-center ${isAuthenticated ? 'cursor-pointer text-red-600' : 'cursor-not-allowed text-gray-400'}`}
                     onClick={onDelete}
                >
                    <IoTrashOutline />
                </div>
            </div>
        </div>
    );
};

const TextList = ({ articleId, texts }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [newParagraph, setNewParagraph] = useState(''); // New paragraph state for editing

    // Delete mutation with refetchQueries to refresh the article after deletion
    const [deleteParagraph] = useMutation(DELETE_PARAGRAPH, {
        refetchQueries: [{ query: GET_ARTICLE_DETAIL, variables: { id: articleId } }],
        awaitRefetchQueries: true
    });

    // Update mutation with refetchQueries to refresh the article after editing
    const [editParagraph] = useMutation(UPDATE_PARAGRAPH, {
        refetchQueries: [{ query: GET_ARTICLE_DETAIL, variables: { id: articleId } }],
        awaitRefetchQueries: true
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);  // Set authentication state
        });
        return () => unsubscribe();
    }, []);

    const onEditClick = (textId, currentParagraph) => {
        if (isAuthenticated) {
            setSelectedTextId(textId);  // Set the selected paragraph ID
            setNewParagraph(currentParagraph);  // Pre-fill the input with the current paragraph text
            setIsEditPopupVisible(true);  // Show the edit popup
        }
    };

    const onDeleteClick = (textId) => {
        if (isAuthenticated) {
            setSelectedTextId(textId);  // Set the selected paragraph ID
            setIsDeletePopupVisible(true);  // Show the delete confirmation popup
        }
    };

    const handleDeleteConfirm = () => {
        deleteParagraph({ variables: { id: selectedTextId } })  // Execute the delete mutation
            .then(() => {
                setIsDeletePopupVisible(false);  // Close the popup after deletion
                setSelectedTextId(null);  // Clear the selected text ID
            })
            .catch(err => console.error(err));
    };

    const handleDeleteCancel = () => {
        setIsDeletePopupVisible(false);  // Hide the popup without deleting
        setSelectedTextId(null);  // Reset the selected text ID
    };

    const handleEditSave = () => {
        editParagraph({ variables: { id: selectedTextId, paragraph: newParagraph } })  // Execute the edit mutation
            .then(() => {
                setIsEditPopupVisible(false);  // Close the popup after saving
                setSelectedTextId(null);  // Clear the selected text ID
                setNewParagraph('');  // Reset the paragraph input
            })
            .catch(err => console.error(err));
    };

    const handleEditCancel = () => {
        setIsEditPopupVisible(false);  // Hide the edit popup
        setSelectedTextId(null);  // Reset the selected text ID
        setNewParagraph('');  // Reset the paragraph input
    };

    if (!texts || texts.length === 0) {
        return <p>No paragraphs to display yet.</p>;
    }

    return (
        <div className='py-4'>
            <h6>Paragraphs:</h6>
            {texts.map((text) => (
                <Item key={text.id}
                      paragraph={text.paragraph}
                      isAuthenticated={isAuthenticated}    
                      onDelete={() => onDeleteClick(text.id)}  // Trigger delete confirmation
                      onEdit={() => onEditClick(text.id, text.paragraph)}  // Pass current paragraph for editing
                />
            ))}

            {/* Popup for delete confirmation */}
            {isDeletePopupVisible && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className='fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 z-50 shadow-lg'>
                        <h3 className='mb-4 text-lg font-semibold'>Are you sure you want to delete this paragraph?</h3>
                        <button 
                            className='mr-3 bg-red-600 text-white py-1 px-3 hover:bg-red-700 transition-colors duration-200'
                            onClick={handleDeleteConfirm}  // Confirm and execute deletion
                        >
                            Delete
                        </button>
                        <button 
                            className='border-gray-400 border text-gray-600 py-1 px-3 hover:bg-gray-100 transition-colors duration-200'
                            onClick={handleDeleteCancel}  // Cancel deletion
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {/* Popup for edit paragraph */}
            {isEditPopupVisible && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className='fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 z-50 shadow-lg'>
                        <h3 className='mb-4 text-lg font-semibold'>Edit Paragraph</h3>
                        <textarea
                            value={newParagraph}
                            onChange={(e) => setNewParagraph(e.target.value)}
                            className='w-full p-2 mb-4 border border-gray-300 rounded'
                        />
                        <button 
                            className='mr-3 bg-[#613A28] text-white py-1 px-3 hover:bg-[#573424] transition-colors duration-200'
                            onClick={handleEditSave}  // Confirm and execute edit
                        >
                            Save
                        </button>
                        <button 
                            className='border-gray-400 border text-gray-600 py-1 px-3 hover:bg-gray-100 transition-colors duration-200'
                            onClick={handleEditCancel}  // Cancel editing
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TextList;