import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import LogIn from './logIn';
import AccRegister from './AccRegister';
import EditAccount from './EditAccount'; // Import EditAccount component

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userName'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userName'));
  }, []);

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold mb-8">Welcome to COSC310 Project</h1>
      <nav>
        <ul className="list-none p-0">
          <li className="inline mx-4">
            <Link to="/login" className="text-blue-500 font-bold hover:text-blue-700">Login</Link>
          </li>
          {isLoggedIn && (
            <li className="inline mx-4">
              <Link to="/edit-account" className="text-blue-500 font-bold hover:text-blue-700">Edit Account</Link>
            </li>
          )}
          {/* Add more links to other features here */}
        </ul>
      </nav>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={LogIn} />
          <Route path="/register" component={AccRegister} />
          <Route path="/edit-account" component={EditAccount} /> {/* Add new route for Edit Account */}
          {/* Add more routes to other features here */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;