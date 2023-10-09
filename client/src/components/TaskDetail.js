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

const Button = styled.button`
  background-color: red;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const Dropdown = styled.select`
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
`;

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const history = useHistory();

  useEffect(() => {
    // Fetch task details using the 'id' from your data source
    fetch(`/tasks/${id}`)
      .then((response) => response.json())
      .then((data) => setTask(data));
  }, [id]);

  const handleStatusChange = () => {
    // Send a request to update the task's status on the server
    fetch(`/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (response.ok) {
          // Refresh the task details after status change
          fetch(`/tasks/${id}`)
            .then((response) => response.json())
            .then((data) => setTask(data));
        } else {
          // Handle error, e.g., show an error message
        }
      });
  };

  const handleDeleteTask = () => {
    // Send a request to delete the task on the server
    fetch(`/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Redirect to a task list page or another appropriate location
          const projectId = task.project_id;
          history.push(`/project/${projectId}`)
        } else {
          // Handle error, e.g., show an error message
        }
      });
  };

  return (
    <PageContainer>
      <LeftNavigationBar />
      <BoxContainer>
        <Heading>Task Details</Heading>
        {task ? (
          <div>
            <h3>Title: {task.title}</h3>
            <p>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
            <p>Description: {task.description}</p>
            <p>
              Status: {task.status}
              <Dropdown
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Dropdown>
              <button onClick={handleStatusChange}>Change Status</button>
            </p>
            <Button onClick={handleDeleteTask}>Delete Task</Button>
          </div>
        ) : (
          <p>Loading task details...</p>
        )}
      </BoxContainer>
    </PageContainer>
  );
}

export default TaskDetail;
