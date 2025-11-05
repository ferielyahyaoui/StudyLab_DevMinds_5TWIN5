import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// CSS template (global, sans bundling)
import './assets/css/animate.css';
import './assets/css/owl.carousel.min.css';
import './assets/css/owl.theme.default.min.css';
import './assets/css/magnific-popup.css';
import './assets/css/bootstrap-datepicker.css';
import './assets/css/jquery.timepicker.css';
import './assets/css/flaticon.css';
import './assets/css/style.css';

// NO JS imports here – chargés via CDN in index.html (évite conflicts Vite/React)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);