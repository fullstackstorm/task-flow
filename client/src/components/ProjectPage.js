import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #3498db;
  color: #fff;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
`;

const TableData = styled.td`
  padding: 10px;
`;

function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState({});

  useEffect(() => {
    // Fetch project data using the ID from the URL
    fetch(`/projects/${id}`)
      .then((response) => response.json())
      .then((data) => setProject(data));
  }, [id]);

  return (
    <BoxContainer>
      <Heading>{project.name}</Heading>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Task</TableHeader>
            <TableHeader>Due Date</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {project.tasks &&
            project.tasks.map((task) => (
              <TableRow key={task.id}>
                <TableData>{task.title}</TableData>
                <TableData>{new Date(task.due_date).toLocaleDateString()}</TableData>
                <TableData>{task.status}</TableData>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </BoxContainer>
  );
}

export default ProjectPage;
