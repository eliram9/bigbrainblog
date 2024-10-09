import React, { useState, useEffect, forwardRef } from 'react';

import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ADD_NEW_PARAGRAPH } from '../queries/addParagraph';
import { auth } from '../utils/firebase';
import SourceCreate from './SourceCreate'; 


const TextCreate = () => {
    const { id } = useParams();
    const [paragraph, setParagraph] = useState(''); // Initialize with an empty string
    const [addTextToArticle, { data, loading, error }] = useMutation(ADD_NEW_PARAGRAPH);
    const [successMessage, setSuccessMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Define your custom toolbar options
    const modules = {
        toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ color: [] }, { background: [] }],
        ['link'],
        ],
    };

  // Track authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = (evt) => {
    evt.preventDefault();

    // Input validation: Check if the paragraph is at least 2 characters long
    if (paragraph.length < 2) {
      alert('Paragraph must be at least 2 characters long.');
      return;
    }

    addTextToArticle({
      variables: {
        articleId: id,
        paragraph: paragraph,
      },
    })
      .then(() => {
        // Clear the input field after successful submission
        setParagraph('');
        // Set success message
        setSuccessMessage('Paragraph added successfully!');
      })
      .catch((error) => {
        console.error('Error adding paragraph:', error);
        alert('Error adding paragraph. Please try again.');
      });
  };

  useEffect(() => {
    if (successMessage) {
      // Clear the success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div>
      <form onSubmit={onSubmit} className="bg-white py-5 px-2">
        <label className="block mb-2 font-medium text-lg">Add Paragraph to Text</label>
        <ReactQuill theme="snow" value={paragraph} onChange={setParagraph} modules={modules} />
        <button
          type="submit"
          disabled={!isAuthenticated}
          className={`w-fit px-5 py-2 border rounded-md ${
            isAuthenticated
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 mt-5'
              : 'bg-gray-500 text-gray-700 cursor-not-allowed mt-5'
          }`}
        >
          Add
        </button>
        {!isAuthenticated && (
          <p className="text-red-500 mt-2">You must be logged in to add a paragraph.</p>
        )}
      </form>
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Render the SourceCreate component and pass the article ID */}
      <SourceCreate articleId={id} />
    </div>
  );
};

export default TextCreate;