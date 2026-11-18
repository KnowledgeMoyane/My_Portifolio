import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Site from './Site.jsx';
import Admin from './admin/Admin.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Site />} />
    </Routes>
  </BrowserRouter>
);
