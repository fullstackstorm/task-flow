import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import MainPage from "./MainPage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import CreateTeamPage from "./CreateTeamPage";
import CreateProjectPage from "./CreateProjectPage";
import Dashboard from "./Dashboard";
import ProjectPage from "./ProjectPage";
import TaskDetail from "./TaskDetail";
import TeamDetail from "./TeamDetail";
import CreateTaskPage from "./CreateTaskPage";

function App()
{
  return (
    <div className="app">
      <Header />
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route exact path="/signup">
          <SignUpPage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/createteam">
          <CreateTeamPage />
        </Route>
        <Route exact path="/createproject">
          <CreateProjectPage />
        </Route>
        <Route exact path="/project/:id">
          <ProjectPage />
        </Route>
        <Route exact path="/task/:id">
          <TaskDetail />
        </Route>
        <Route exact path="/team/:id">
          <TeamDetail />
        </Route>
        <Route exact path="/createtask">
          <CreateTaskPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
