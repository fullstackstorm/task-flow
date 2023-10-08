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
  text-align: left; // Make the column headings left-aligned
`;

const TableData = styled.td`
  padding: 10px;
`;

function TaskBox({ tasks }) {
  const sortedTasks = tasks
    .filter((task) => task.status !== 'completed')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const displayedTasks = sortedTasks.slice(0, 6);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };

  return (
    <BoxContainer>
      <Heading>My Tasks</Heading>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Task</TableHeader>
            <TableHeader>Due Date</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {displayedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableData>{task.title}</TableData>
              <TableData>{formatDate(task.due_date)}</TableData>
              <TableData>{task.status}</TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </BoxContainer>
  );
}

export default TaskBox;
