import React from 'react';
import { signInWithGoogle } from '../utils/firebase';

const Login = () => {
    return (
        <div>
            <button onClick={signInWithGoogle}>Login with Google</button>
        </div>
    );
};

export default Login;