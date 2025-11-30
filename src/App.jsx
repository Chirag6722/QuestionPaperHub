import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import { AuthProvider } from './contexts/AuthContext';

import PrivateRoute from './components/PrivateRoute';
import UploadPaper from './pages/UploadPaper';
import MyUploads from './pages/MyUploads';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <UploadPaper />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-uploads"
              element={
                <PrivateRoute>
                  <MyUploads />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
