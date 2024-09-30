import React from 'react';

import { Link } from 'react-router-dom';
import { IoTrashOutline } from "react-icons/io5";
import { LuFileEdit } from "react-icons/lu";
import { signInWithGoogle } from '../utils/firebase'; 

import { formatDate } from '../utils/formatDate';

// Article component for every article on the list.
const Article = ({ id, title, summary, createdDate, author, onArticleDelete, onTitleEdit, isAuthenticated }) => {
    return (
        <div className='mb-4'>
            <ul className='flex justify-between bg-white text-slate-800 px-3 py-2 border-[2px] rounded-sm border-emerald-600 mb-4 shadow-lg
                          hover:bg-gray-300 transition-colors duration-300 ease-in-out '>
                <Link to={`/articles/${id}`}>
                    {title}
                    <p className='text-xs text-gray-500 mt-2'>By: {author}</p>
                    <p className='text-xs text-gray-500'>Created Date: {formatDate(createdDate)}</p>
                </Link>
                <div className='flex'>
                    <i className={`flex items-center mr-5 ${isAuthenticated ? 'cursor-pointer text-emerald-600' : 'cursor-not-allowed text-gray-400'}`}
                        onClick={() => isAuthenticated ? onTitleEdit(id, title) : signInWithGoogle()}
                    >
                        <LuFileEdit className="text-lg" />
                    </i>
                    <i className={`flex items-center ${isAuthenticated ? 'cursor-pointer text-red-600' : 'cursor-not-allowed text-gray-400'}`}
                        onClick={() => isAuthenticated ? onArticleDelete(id, title) : signInWithGoogle()}
                    >
                        <IoTrashOutline className="text-xl" />
                    </i>
                </div>
                
            </ul>
        </div>
    );
};

export default Article
