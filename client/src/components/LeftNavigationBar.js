import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LeftNavContainer = styled.nav`
  width: 250px;
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100vh;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SubList = styled.ul`
  list-style: none;
  padding-left: 20px; /* Add indentation to sub-list */
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const SubItem = styled.li`
  margin: 4px 0;
`;

// Styled Link for the "Home" button
const HomeLink = styled(Link)`
  color: inherit; /* Inherit the text color from the parent */
  text-decoration: none; /* Remove the default underline */
`;

function LeftNavigationBar() {
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const toggleTeams = () => {
    setTeamsOpen(!teamsOpen);
  };

  const toggleProjects = () => {
    setProjectsOpen(!projectsOpen);
  };

  const toggleForm = () => {
    setFormOpen(!formOpen);
  };

  return (
    <LeftNavContainer>
      <NavList>
        <NavItem>
          <HomeLink to="/dashboard">Home</HomeLink>
        </NavItem>
        <NavItem onClick={toggleForm}>
          <div>
            Create
            {formOpen ? "▼" : "▶"}
          </div>
          <SubList isOpen={formOpen}>
            <SubItem>Team</SubItem>
            <SubItem>Project</SubItem>
          </SubList>
        </NavItem>
        <NavItem onClick={toggleTeams}>
          <div>
            Teams
            {teamsOpen ? "▼" : "▶"}
          </div>
          <SubList isOpen={teamsOpen}></SubList>
        </NavItem>
        <NavItem onClick={toggleProjects}>
          <div>
            Projects
            {projectsOpen ? "▼" : "▶"}
          </div>
          <SubList isOpen={projectsOpen}></SubList>
        </NavItem>
      </NavList>
    </LeftNavContainer>
  );
}

export default LeftNavigationBar;
