import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_NEW_PARAGRAPH } from '../queries/addParagraph';

const TextCreate = () => {
    const { id } = useParams();
    const [paragraph, setParagraph] = useState('');
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
            <form onSubmit={onSubmit}>
                <label>Add Paragraph to Text</label>
                <input
                    value={paragraph}
                    onChange={(evt) => setParagraph(evt.target.value)}
                />
                <button type="submit" style={{ color: "black" }}>Submit</button>
            </form>    
        </div>
    );
};

export default TextCreate;
