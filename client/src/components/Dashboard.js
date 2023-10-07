import React, {useEffect, useState} from "react";
import LeftNavigationBar from "./LeftNavigationBar";
import TaskBox from "./TaskBox";
import styled from "styled-components";

const DashboardContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  padding: 16px;
`;

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks for task box:', err));
  }, []);

  return (
    <DashboardContainer>
      <LeftNavigationBar />
      <Content>
        <div>
          <TaskBox tasks={tasks}/>
          <h3>Projects For Team Blank</h3>
        </div>
      </Content>
    </DashboardContainer>
  );
}

export default Dashboard;
