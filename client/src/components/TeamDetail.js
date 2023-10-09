import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import LeftNavigationBar from "./LeftNavigationBar";
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
`;

const BoxContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
`;

const Button = styled.button`
  background-color: red;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // Fetch team details using the 'id' from your data source
    fetch(`/teams/${id}`)
      .then((response) => response.json())
      .then((data) => setTeam(data));
  }, [id]);

  const handleDeleteTeam = () => {
    // Send a request to delete the team on the server
    fetch(`/teams/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          history.push("/dashboard");
        } else {
          // Handle error, e.g., show an error message
        }
      });
  };

  return (
    <PageContainer>
      <LeftNavigationBar />
      <BoxContainer>
        <Heading>Team Details</Heading>
        {team ? (
          <div>
            <h3>Name: {team.name}</h3>
            <p>Description: {team.description}</p>
            <div>
              <h4>Users:</h4>
              <UserList>
                {team.users.map((user) => (
                  <ListItem key={user.id}>{user.username}</ListItem>
                ))}
              </UserList>
            </div>
            <Button onClick={handleDeleteTeam}>Delete Team</Button>
          </div>
        ) : (
          <p>Loading team details...</p>
        )}
      </BoxContainer>
    </PageContainer>
  );
}

export default TeamDetail;
