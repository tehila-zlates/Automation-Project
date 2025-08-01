import React, { useState } from 'react';
import validator from 'validator';
import SignPage from '../SignPage/SignPage';
import { useNavigate } from 'react-router-dom';

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
      } else {
        alert(data.message || 'Error uploading file');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };
  const toSignPage = () => {
    navigate(`/sign/${fileUrl}`);
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
        <button className="btn btn-success mt-2" onClick={toSignPage}>
          סיום חתימה ושליחה
        </button>
      )}
    </div>
  );
}

export default UploadForm;
