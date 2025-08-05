import React, { useState } from 'react';
import validator from 'validator';
import SignPage from '../SignPage/SignPage';
import { useNavigate, Link } from 'react-router-dom';

function UploadForm() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => validator.isEmail(email);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("כתובת המייל לא תקינה");
      return;
    }
    if (!file) {
      setError('יש לבחור קובץ');
      return;
    }
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);    

    try {
      const res = await fetch('https://automation-project-server.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setFileUrl(data.filename);
        console.log("4564654");
        
      } else {
        alert(data.message || 'Error uploading file');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh', direction: 'rtl' }}
    >
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">העלאת מסמך</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">כתובת אימייל</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="הכנס כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="fileUpload">להעלאת הקובץ</label>
            <input
              type="file"
              className="form-control"
              id="fileUpload"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]); 
                }
              }}
            />
          </div>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">
            שלח
          </button>
        </form>
 {fileUrl && (
        <a
          href={`/sign/${encodeURIComponent(fileUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-link d-block mt-2 text-center"
        >
          לצפייה בקובץ ולחתימה
        </a>
      )} 
      </div>
    </div>
  );

}

export default UploadForm;
