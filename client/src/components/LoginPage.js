import React from 'react';
import LoginForm from './LoginForm'

function LoginPage(){
    return (
        <div className="login-page">
            <h2>Welcome to Task Flow</h2>
            <h3>To get started, give an email, username, and password.</h3>
            <LoginForm></LoginForm>
        </div>
    )
}

export default LoginPage;