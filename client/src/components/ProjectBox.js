import React from 'react';
import styled from 'styled-components';

const BoxContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ProjectElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProjectIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #3498db;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const ProjectName = styled.h4`
  margin-top: 10px;
  text-align: center;
`;

function ProjectBox({ projects }) {
  const displayedProjects = projects.slice(0, 6);

  return (
    <BoxContainer>
      <Heading>My Projects</Heading>
      <Container>
        {displayedProjects.map((project) => (
          <ProjectElement key={project.id}>
            <ProjectIcon>{project.name[0]}</ProjectIcon>
            <ProjectName>{project.name.slice(0, 15) + '. . .'}</ProjectName>
          </ProjectElement>
        ))}
      </Container>
    </BoxContainer>
  );
}

export default ProjectBox;
