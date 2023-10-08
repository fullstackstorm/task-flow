import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const HeaderRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s; /* Add a smooth transition effect */
  
  &:hover {
    background-color: #ccc; /* Change the background color on hover */
  }
  a {
    text-decoration: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
`;

const TableData = styled.td`
  padding: 10px;
`;

function TaskSection({ title, tasks })
{
    return (
        <div>
            <h3>{title}</h3>
            <Table>
                <TableHead>
                    <HeaderRow>
                        <TableHeader>Task</TableHeader>
                        <TableHeader>Due Date</TableHeader>
                    </HeaderRow>
                </TableHead>
                <tbody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableData>
                                <StyledLink to={`/tasks/${task.id}`}>{task.title}</StyledLink>
                            </TableData>
                            <TableData>{new Date(task.due_date).toLocaleDateString()}</TableData>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

function ProjectPage()
{
    const { id } = useParams();
    const [project, setProject] = useState({
        pendingTasks: [],
        inProgressTasks: [],
        completedTasks: [],
    });

    useEffect(() =>
    {
        // Fetch project data using the ID from the URL
        fetch(`/projects/${id}`)
            .then((response) => response.json())
            .then((data) =>
            {
                const { tasks } = data;
                const pendingTasks = tasks.filter(task => task.status === 'pending');
                const inProgressTasks = tasks.filter(task => task.status === 'in progress');
                const completedTasks = tasks.filter(task => task.status === 'completed');

                setProject({ pendingTasks, inProgressTasks, completedTasks, ...data });
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
