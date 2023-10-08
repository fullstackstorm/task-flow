import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background-color: #3498db;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
`;

const NavItems = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NavItem = styled.div`
  margin-left: 10px;

  a {
    text-decoration: none;
    color: #fff;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Header()
{
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() =>
    {
        // Check user session to determine if the user is logged in
        fetch('/check_session', {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) =>
            {
                if (response.status === 200)
                {
                    setIsLoggedIn(true);
                }
            })
            .catch((error) =>
            {
                console.error('Error checking user session:', error);
            });
    }, []);

    return (
        <HeaderContainer>
            <NavItems>
                {isLoggedIn ? (
                    <NavItem>
                        <LogoutButton>Logout</LogoutButton>
                    </NavItem>
                ) : (
                    <>
                        <NavItem>
                            <NavLink to="/login" exact>
                                Login
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/signup" exact>
                                Get Started
                            </NavLink>
                        </NavItem>
                    </>
                )}
            </NavItems>
        </HeaderContainer>
    );
}

export default Header;
