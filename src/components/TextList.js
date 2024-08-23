import React from 'react';

const TextList = ({ texts }) => {
    // Check if texts is an array and map over it safely
    if (!texts || texts.length === 0) {
        return <p>No paragraphs to display yet.</p>;
    }

    return (
        <div>
            <h6 style={{ marginBottom: "20px" }}>Paragraphs</h6>
            {texts.map((text, index) => (
                <li key={text.id} className='collection-item' style={{ padding: "10px 15px", border: "1px solid green", marginBottom: "20px" }}>
                    {text.paragraph}
                </li>
            ))}
        </div>
    );
};

export default TextList;