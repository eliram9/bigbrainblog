import React, { useState, useEffect } from 'react';

const ArticleTitlesEdit = ({ article, onClose, onSave }) => {
  const [editTitle, setEditTitle] = useState(article?.title || '');
  const [editAuthor, setEditAuthor] = useState(article?.author || '');
  const [editCategory, setEditCategory] = useState(article?.category || 'EMDR Therapy General');
  const [editOpeningImageUrl, setEditOpeningImageUrl] = useState(article?.openingImageUrl);
  const [editSummary, setEditSummary] = useState(article?.summary || '');

    const handleSave = () => {
        onSave({
        id: article.id,
        title: editTitle,
        author: editAuthor,
        category: editCategory,
        openingImageUrl: editOpeningImageUrl,
        summary: editSummary
        });
    };

    // Close the popup when the Escape key is pressed
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    
        // Cleanup the event listener when the component is unmounted
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
      }, [onClose]);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
            <div className="w-3/5 fixed top-0 left-1/2 transform -translate-x-1/2 p-5 bg-white border border-gray-300 z-50 shadow-lg max-h-screen overflow-y-auto">
                <h3 className="mb-8 text-xl font-semibold">Edit Article Titles</h3>

                {/* Input field for editing the title */}
                <div className="mb-6">
                    <label className="block font-medium mb-1 text-sm">Title:</label>
                    <input type="text"
                        value={editTitle}
                        onChange={(evt) => setEditTitle(evt.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Input field for editing the author */}
                <div className="mb-6">
                    <label className="block font-medium mb-1">Author:</label>
                    <input type="text"
                           value={editAuthor}
                           onChange={(evt) => setEditAuthor(evt.target.value)}
                           className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Select field for category */}
                <div className="mb-6">
                    <label className="block font-medium mb-1">Category:</label>
                    {/* Display current category */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1 bg-gray-200 border-gray-400 py-1 border">Current Category: {article?.category}</label>
                    </div>
                    <select value={editCategory}
                            onChange={(evt) => setEditCategory(evt.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="EMDR Therapy General">EMDR Therapy General</option>
                        <option value="EMDR for Trauma and PTSD">EMDR for Trauma and PTSD</option>
                        <option value="EMDR for Anxiety and Stress">EMDR for Anxiety and Stress</option>
                        <option value="EMDR and ADHD">EMDR and ADHD</option>
                        <option value="EMDR Success Stories">EMDR Success Stories</option>
                    </select>
                </div>

                {/* Display current opening image */}
                {article?.openingImageUrl && (
                <div className="mb-6">
                    <label className="block font-medium mb-1">Current Opening Image:</label>
                    <img src={article.openingImageUrl}
                         alt="Current Opening Image"
                         className="w-3/5 mx-auto h-auto "
                    />
                </div>
                )}

                {/* Input field for editing the opening image URL */}
                <div className="mb-6">
                    <label className="block font-medium mb-1">Opening Image URL:</label>
                    <input type="text"
                        value={editOpeningImageUrl}
                        onChange={(evt) => setEditOpeningImageUrl(evt.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Text area for editing the article summary */}
                <div className="mb-6">
                    <label className="block font-medium mb-1">Summary:</label>
                    <textarea value={editSummary}
                            onChange={(evt) => setEditSummary(evt.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="5"
                    />
                </div>

                {/* Save and Cancel buttons */}
                <div className="flex justify-end">
                    <button onClick={handleSave}
                            className="mr-3 bg-emerald-600 text-white py-1 px-3 hover:bg-emerald-700 transition-colors duration-200 rounded-md"
                    >
                        Save
                    </button>
                    <button onClick={onClose}
                            className="bg-gray-500 text-white py-1 px-3 hover:bg-gray-600 transition-colors duration-200 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
};

export default ArticleTitlesEdit;