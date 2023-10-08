import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import MainPage from "./MainPage";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import CreateTeamPage from "./CreateTeamPage";
import ProjectPage from "./ProjectPage";
import Dashboard from "./Dashboard";

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
        <Route exact path="/project/:id">
          <ProjectPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
