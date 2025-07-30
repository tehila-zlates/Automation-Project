import React from 'react';
import logo from './logo.svg';
import './App.css';
import UpdateFile from './components/UpdateFile/UpdateFile';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadForm from './components/UpdateFile/UpdateFile';
import SignPage from './components/SignPage/SignPage';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.mjs`;

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<UploadForm></UploadForm>} />
        <Route path="/sign/:filename" element={<SignPage></SignPage>} />
      </Routes>
    </Router>
    
  );
}

export default App;
