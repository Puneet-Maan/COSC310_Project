import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import LogIn from './logIn';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Welcome to COSC310 Project</h1>
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link> {/* Link to the login page */}
            </li>
            {/* Add more links to other features here */}
          </ul>
        </nav>
        <Switch>
          <Route path="/login" component={LogIn} /> {/* Route for the login page */}
          {/* Add more routes to other features here */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;