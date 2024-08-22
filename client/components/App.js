import React from 'react';
import { Outlet } from 'react-router-dom';

const App = () => {
    return (
        <div>
            <Outlet />  {/* This is where nested routes will be rendered */}
        </div>
    );
}

export default App;
