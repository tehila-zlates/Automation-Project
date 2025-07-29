import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import validator from 'validator';

function UploadForm() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const { filename } = useParams();

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
      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // כאן מציגים את דף החתימה (ה-React route)
        setFileUrl(data.signPageUrl);
      } else {
        alert(data.message || 'Error uploading file');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div>
      <h2>העלאת מסמך</h2>
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
        <button type="submit" className="btn btn-primary">
          שלח
        </button>
      </form>
      {fileUrl && (
        <a href={encodeURI(fileUrl)} target="_blank" rel="noopener noreferrer">
          לצפייה בקובץ ולחתימה
        </a>
      )}
    </div>
  );
}

export default UploadForm;