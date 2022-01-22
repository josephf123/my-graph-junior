import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Signup';
import Login from './components/Login';
import UpdateProfile from './components/UpdateProfile';
import ForgotPassword from './components/ForgotPassword';

ReactDOM.render(
  <React.StrictMode>
    <div>

    <Router >
            <AuthProvider>
              <Routes>
                <Route path="/" element={<ProtectedRoute>
                  <App />
                </ProtectedRoute>}/>
                    
                <Route path="/signup" element={<Signup/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ProtectedRoute><ForgotPassword/></ProtectedRoute>} />
              </Routes>
            </AuthProvider>
        </Router>
    </div>
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);



