import React, { useState, useEffect } from 'react';
import { signOutUser, useAuth } from '../utils/firebase';

import { MdOutlineLogout } from "react-icons/md";
import { Link } from 'react-router-dom';

const Navbar = () => {
    // State to track the current authenticated user
    const [currentUser, setCurrentUser] = useState(null);

    // Using the useAuth hook to get the current user
    const user = useAuth();

    // Update the currentUser state whenever the authentication state changes
    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    return (
        <div className="flex justify-between items-center py-4 px-8 bg-gray-800 text-white">
            <Link to="/" className="text-xl font-bold">BigBrainBlog</Link>
            <div className="flex items-center">
                {currentUser ? (
                    <>
                        <div className="mr-4">
                            {/* Safely check for displayName or use a default value */}
                            {currentUser.displayName 
                                ? 
                                <p className='border-red-600 border p-1'>{currentUser.displayName.split(' ').map(name => name.charAt(0)).join('')}</p> 
                                : ''}
                        </div>
                        <button
                            onClick={signOutUser}
                            className="text-white text-xl hover:text-red-600"
                        >
                            <MdOutlineLogout />
                        </button>
                    </>
                ) : (
                    // Leave this space blank if no user is logged in
                    <div className="mr-4"></div>
                )}
            </div>
        </div>
    );
};

export default Navbar;