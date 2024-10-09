import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_SOURCE_TO_ARTICLE } from '../queries/addSourceToArticle';
import { auth } from '../utils/firebase';

const SourceCreate = ({ articleId }) => {
    const [sourceName, setSourceName] = useState('');
    const [url, setUrl] = useState('');
    const [addSourceToArticle] = useMutation(ADD_SOURCE_TO_ARTICLE);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Track authentication state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        // Input validation
        if (sourceName.trim() === '' || url.trim() === '') {
            alert('Please fill in all fields.');
        return;
        }

        try {
        await addSourceToArticle({
            variables: { articleId, sourceName, url },
            // Optionally refetch queries or update cache here
        });
        // Clear form fields after submission
        setSourceName('');
        setUrl('');
        // Set success message
        setSuccessMessage('Source added successfully!');
        } catch (error) {
            console.error('Error adding source:', error);
        alert('Error adding source. Please try again.');
        }
    };

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div className="mt-8 bg-slate-300 p-2">
            <form onSubmit={handleSubmit} className="mb-4">
                <h4 className="mb-2 text-xl font-semibold">Add Source</h4>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Source Name:</label>
                    <input
                        type="text"
                        value={sourceName}
                        onChange={(evt) => setSourceName(evt.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">URL:</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(evt) => setUrl(evt.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit"
                        disabled={!isAuthenticated}
                        className={`${
                            isAuthenticated
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        } text-white px-4 py-2 rounded`}
                >
                    Add Source
                </button>
                {!isAuthenticated && (
                    <p className="text-red-500 mt-2">You must be logged in to add a source.</p>
                )}
            </form>
            {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>
    );
};

export default SourceCreate;