import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

function TaskSection({ title, tasks }) {
  return (
    <div>
      <h3>{title}</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Task</TableHeader>
            <TableHeader>Due Date</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableData>{task.title}</TableData>
              <TableData>{new Date(task.due_date).toLocaleDateString()}</TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState({
    pendingTasks: [],
    inProgressTasks: [],
    completedTasks: [],
  });

  useEffect(() => {
    // Fetch project data using the ID from the URL
    fetch(`/projects/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const tasks = data.tasks;
        const pendingTasks = tasks.filter(task => task.status === 'pending');
        const inProgressTasks = tasks.filter(task => task.status === 'in progress');
        const completedTasks = tasks.filter(task => task.status === 'completed');
  
        setProject({
          ...data, // Include other project data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        });
      });
  }, [id]);

  return (
    <PageContainer>
      <LeftNavigationBar />
      <BoxContainer>
        <Heading>{project.name}</Heading>
        <TaskSection title="Pending Tasks" tasks={project.pendingTasks} />
        <TaskSection title="In Progress Tasks" tasks={project.inProgressTasks} />
        <TaskSection title="Completed Tasks" tasks={project.completedTasks} />
      </BoxContainer>
    </PageContainer>
  );
}

export default ProjectPage;
