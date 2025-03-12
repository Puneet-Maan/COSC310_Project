import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import LogIn from './pages/logIn.js';
import AccRegister from './pages/AccRegister.js';
import EditAccount from './pages/EditAccount.js';
import AdminDashboard from './pages/AdminDashboard.js';
import CheckAdmin from './pages/checkAdmin.js'; // Import CheckAdmin component

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userName'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userName'));
  }, []);

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold mb-8 text-white">University of NullPointers</h1>
      <nav>
        <ul className="list-none p-0">
          <li className="inline mx-4">
            <Link to="/login" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Login</Link>
          </li>
          {isLoggedIn && (
            <li className="inline mx-4">
              <Link to="/edit-account" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Edit Account</Link>
            </li>
          )}
          {/* Just Temp this can be removed */}
          <li className="inline mx-4">
            <a href="/browse_course.html" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Browse Courses</a> 
          </li>
          <li className="inline mx-4">
            <Link to="/admin-dashboard" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Dashboard</Link>
          </li>
          <li className="inline mx-4">
            <Link to="/check-admin" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Check Admin</Link>
          </li>
          {/* Add more links to other features here */}
        </ul>
      </nav>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#1b2a4e] text-white">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={LogIn} />
          <Route path="/register" component={AccRegister} />
          <Route path="/edit-account" component={EditAccount} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/check-admin" component={CheckAdmin} /> {/* Add route for CheckAdmin */}
          {/* Add more routes to other features here */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;