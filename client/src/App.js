import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import LogIn from './logIn';

function Home() {
  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold mb-8">Welcome to COSC310 Project</h1>
      <nav>
        <ul className="list-none p-0">
          <li className="inline mx-4">
            <Link to="/login" className="text-blue-500 font-bold hover:text-blue-700">Login</Link>
          </li>
          <li className="inline mx-4">
           { /* the link is just to test the browse_course page */}
            <a href="/browse_course.html" className="text-blue-500 font-bold hover:text-blue-700">Browse Courses</a>
          </li>
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
          {/* Add more routes to other features here */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;