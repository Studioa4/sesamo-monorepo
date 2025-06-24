import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import './index.css';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ToastContainer } from 'react-toastify';

// all'interno di ReactDOM.createRoot:
<React.StrictMode>
  <App />
  <ToastContainer /> {/* Questo va aggiunto */}
</React.StrictMode>

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);