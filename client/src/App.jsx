import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import CVPreview from './components/CVPreview';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/preview/:sessionId" element={<CVPreview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
