import React from "react";
import LeftNavigationBar from "./LeftNavigationBar";
import styled from "styled-components";

const DashboardContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  padding: 16px;
`;

function Dashboard() {
  return (
    <DashboardContainer>
      <LeftNavigationBar />
      <Content>
        <div>
          <h2>My Tasks</h2>
          <h3>Projects For Team Blank</h3>
        </div>
      </Content>
    </DashboardContainer>
  );
}

export default Dashboard;
