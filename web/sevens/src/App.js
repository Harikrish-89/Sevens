import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Auth from "./containers/Auth/Auth";
import Home from "./containers/Home/home";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";

function App() {
  const routes = (
    <Switch>
      <Route path="/login" component={Auth} />
      <Route path="/home" component={Home} />
      <Redirect from="/" to="/login" />
    </Switch>
  );
  return (
    <DndProvider options={HTML5toTouch}>
      <BrowserRouter>
        <Suspense fallback={<p>...Loading"</p>}>{routes}</Suspense>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;
