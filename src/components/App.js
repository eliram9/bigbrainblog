import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';

const App = () => {
    return (
        <div>
            <Navbar />
            <Outlet />  {/* This is where nested routes will be rendered */}
        </div>
    );
}

export default App;
