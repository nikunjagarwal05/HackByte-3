import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Signin from './signin/Signin';
import Dashboard from './components/Dashboard';
import LLMOutput from './components/LLMOutput';

function App() {
  return (
    <div className="bg-[#F8F9FA] h-[100vh]">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/llm' element={<LLMOutput />} />
      </Routes>
    </div>
  );
}

export default App;
