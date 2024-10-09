import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { IoTrashOutline } from 'react-icons/io5';
import { LuFileEdit } from 'react-icons/lu';

import { auth } from '../utils/firebase';
import { DELETE_SOURCE } from '../queries/deleteSource';
import { UPDATE_SOURCE } from '../queries/updateSource';
import { GET_ARTICLE_DETAIL } from '../queries/fetchArticle';


const SourceList = ({ articleId, sources }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [selectedSourceId, setSelectedSourceId] = useState(null);
    const [newSourceName, setNewSourceName] = useState('');
    const [newUrl, setNewUrl] = useState('');
  
    // Delete mutation with refetchQueries to refresh the article after deletion
    const [deleteSource] = useMutation(DELETE_SOURCE, {
        refetchQueries: [{ query: GET_ARTICLE_DETAIL, variables: { id: articleId } }],
        awaitRefetchQueries: true,
    });
  
    // Update mutation with refetchQueries to refresh the article after editing
    const [updateSource] = useMutation(UPDATE_SOURCE, {
        refetchQueries: [{ query: GET_ARTICLE_DETAIL, variables: { id: articleId } }],
        awaitRefetchQueries: true,
    });
  
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);
  
    const onEditClick = (source) => {
        if (isAuthenticated) {
            setSelectedSourceId(source.id);
            setNewSourceName(source.sourceName);
            setNewUrl(source.url);
            setIsEditPopupVisible(true);
        }
    };
  
    const onDeleteClick = (sourceId) => {
        if (isAuthenticated) {
            setSelectedSourceId(sourceId);
            setIsDeletePopupVisible(true);
        }
    };
  
    const handleDeleteConfirm = () => {
    deleteSource({ variables: { id: selectedSourceId } })
        .then(() => {
            setIsDeletePopupVisible(false);
            setSelectedSourceId(null);
        })
        .catch((err) => console.error(err));
    };
  
    const handleDeleteCancel = () => {
        setIsDeletePopupVisible(false);
        setSelectedSourceId(null);
    };
  
    const handleEditSave = () => {
        if (newSourceName.trim() === '' || newUrl.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }
  
        updateSource({
            variables: {
            id: selectedSourceId,
            sourceName: newSourceName,
            url: newUrl,
            },
        })
        .then(() => {
            setIsEditPopupVisible(false);
            setSelectedSourceId(null);
            setNewSourceName('');
            setNewUrl('');
        })
        .catch((err) => console.error(err));
    };
  
    const handleEditCancel = () => {
        setIsEditPopupVisible(false);
        setSelectedSourceId(null);
        setNewSourceName('');
        setNewUrl('');
    };
  
    if (!sources || sources.length === 0) {
        return <p>No sources to display yet.</p>;
    }
  
    return (
        <div className="py-4">
            <h3 className="text-lg font-semibold mb-2">Sources:</h3>
            {sources.map((source) => (
                <div key={source.id}
                    className="flex items-center justify-between py-3 px-4 border-[2px] rounded-sm border-gray-500 mb-5 hover:bg-gray-300"
                >
                    <div className="flex-grow mr-3">
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-gray-600">
                            {source.sourceName}
                        </a>
                    </div>
        
                    <div className="flex items-center space-x-3">
                        <div className={`flex items-center ${
                                isAuthenticated ? 'cursor-pointer text-emerald-600' : 'cursor-not-allowed text-gray-400'
                            }`}
                            onClick={() => onEditClick(source)}
                        >
                            <LuFileEdit />
                        </div>
            
                        <div className={`flex items-center ${
                                isAuthenticated ? 'cursor-pointer text-rose-600' : 'cursor-not-allowed text-gray-400'
                            }`}
                            onClick={() => onDeleteClick(source.id)}
                        >
                            <IoTrashOutline />
                        </div>
                    </div>
                </div>
            ))}
  
            {/* Popup for delete confirmation */}
            {isDeletePopupVisible && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 z-50 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold">Are you sure you want to delete this source?</h3>
                        <button className="mr-3 bg-rose-600 text-white hover:bg-rose-700 transition-colors duration-200 py-1 px-2 rounded-md"
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </button>
                        <button
                            className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 py-1 px-2 rounded-md"
                            onClick={handleDeleteCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
  
            {/* Popup for edit source */}
            {isEditPopupVisible && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    <div className="fixed w-1/2 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-white border border-gray-300 z-50 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold">Edit Source</h3>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Source Name:</label>
                            <input type="text"
                                   value={newSourceName}
                                   onChange={(evt) => setNewSourceName(evt.target.value)}
                                   className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">URL:</label>
                            <input type="text"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <button className="mr-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200 py-1 px-2 rounded-md"
                                onClick={handleEditSave}
                        >
                            Save
                        </button>
                        <button className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 py-1 px-2 rounded-md"
                                onClick={handleEditCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
  
export default SourceList;