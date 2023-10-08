import React, {useEffect, useState} from "react";
import LeftNavigationBar from "./LeftNavigationBar";
import TaskBox from "./TaskBox";
import ProjectBox from "./ProjectBox";
import styled from "styled-components";

const DashboardContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  padding: 16px;
`;

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks for task box:', err));
  }, []);

  useEffect(() => {
    fetch('/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Error fetching projects for project box:', err));
  }, []);

  return (
    <DashboardContainer>
      <LeftNavigationBar />
      <Content>
        <div>
          <TaskBox tasks={tasks}/>
          <ProjectBox projects={projects}/>
        </div>
      </Content>
    </DashboardContainer>
  );
}

export default Dashboard;
