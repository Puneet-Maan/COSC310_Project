import React, {useEffect, useState} from 'react';

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setBackendData(data))
  }, []);

  return (
    <div>
      <h1>React App</h1>
      <h2>Backend Data</h2>

      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ): (
        backendData.users.map((user, index) => (
          <p key={index}>{user}</p>
        ))
      )}
    </div>
  );
}

export default App