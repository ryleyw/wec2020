import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from "./Routes/home";
import LoginPage from "./Routes/login";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";


export default function App() {
  return (
    <Router>
      
      <div>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/Login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <HomePage />
}

function Login() {
  return <LoginPage />
}