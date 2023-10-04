import React from 'react';
import SignUpForm from './SignUpForm'

function SignUpPage(){
    return (
        <div className="signup-page">
            <h2>Welcome to Task Flow</h2>
            <h3>To get started, give an email, username, and password.</h3>
            <SignUpForm></SignUpForm>
        </div>
    )
}

export default SignUpPage;