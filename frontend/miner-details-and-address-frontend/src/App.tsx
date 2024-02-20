import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MinerDetails from './MinerDetails';
import AddressDetails from './AddressDetails'; // Assuming this is your component for displaying address details

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Header content */}
        </header>
        <Routes>
          <Route path="/" element={<MinerDetails />} />
          <Route path="/address/:address" element={<AddressDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
