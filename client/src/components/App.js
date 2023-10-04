import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import SignUpPage from './SignUpPage';

function App() {
  return (
    <div className="app">
      <Header />
      <Switch>
        <Route exact path="/"></Route>
        <Route exact path="/signup">
          <SignUpPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
