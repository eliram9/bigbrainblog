import React, { useState, useEffect, forwardRef } from 'react';

import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ADD_NEW_PARAGRAPH } from '../queries/addParagraph';

// A new component that wraps ReactQuill with forwardRef
const QuillWrapper = forwardRef((props, ref) => (
    <ReactQuill {...props} ref={ref} />
  ));

const TextCreate = () => {
    const { id } = useParams();
    const [paragraph, setParagraph] = useState(''); // Initialize with an empty string
    const [addTextToArticle, { data, loading, error }] = useMutation(ADD_NEW_PARAGRAPH);
    const [successMessage, setSuccessMessage] = useState('');

    const onSubmit = (evt) => {
        evt.preventDefault();

        // Input validation: Check if the paragraph is at least 2 characters long
        if (paragraph.length < 2) {
            alert("Paragraph must be at least 2 characters long.");
            return;
        }

        addTextToArticle({
            variables: {
                articleId: id,
                paragraph: paragraph
            }
        }).then(() => {
            // Clear the input field after successful submission
            setParagraph('');
            // Set success message
            setSuccessMessage('Paragraph added successfully!');
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
            <form onSubmit={onSubmit}
                  className='bg-white py-5 px-2'
            >
                <label>Add Paragraph to Text</label>
                <ReactQuill
                    theme="snow"
                    value={paragraph}
                    onChange={setParagraph} // Directly set the new value
                />
                <button type="submit"
                        className='bg-[#613A28] text-white w-fit px-5 py-2 mt-3 border mb-5 hover:bg-gray-500'
                >
                    Submit
                </button>
            </form>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        </div>
    );
};

export default TextCreate;