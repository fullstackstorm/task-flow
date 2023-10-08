import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const StyledButton = styled.button`
  background: none;
  border: none;
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

function LogoutButton()
{
    const history = useHistory();

    const handleLogout = () =>
    {
        // Perform the logout and redirect the user to the main page
        fetch('/logout', {
            method: 'DELETE',
            credentials: 'include',
        })
            .then((response) =>
            {
                if (response.status === 204)
                {
                    history.push('/'); // Redirect to the main page
                }
            })
            .catch((error) =>
            {
                console.error('Error logging out:', error);
            });
    };

    return (
        <StyledButton onClick={handleLogout}>Logout</StyledButton>
    );
}

export default LogoutButton;
