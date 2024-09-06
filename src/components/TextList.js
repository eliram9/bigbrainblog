import React from 'react';

const TextList = ({ texts }) => {
    // Check if texts is an array and map over it safely
    if (!texts || texts.length === 0) {
        return <p>No paragraphs to display yet.</p>;
    }

    return (
        <div className='py-4'>
            <h6>Paragraphs:</h6>
            {texts.map((text, index) => (
                <li key={text.id} className='py-3 px-4 border border-green-700 mb-5 overflow-auto'>
                    {text.paragraph}
                </li>
            ))}
        </div>
    );
};

export default TextList;