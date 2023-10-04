import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";

function App() {
  return (
    <div className="app">
      <Header/>
      <Switch>
        <Route exact path="/">
          
        </Route>
      </Switch>
    </div>
  )
}

export default App;
