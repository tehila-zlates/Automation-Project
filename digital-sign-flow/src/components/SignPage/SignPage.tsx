import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SignDocument from '../SignaturePad/SignaturePad';

function SignPage() {
  const { filename } = useParams();
  const [done, setDone] = useState(false);

  const fileUrl = useMemo(() => {
    console.log("huuhuhiuhi");
    
    return `https://automation-project-server.onrender.com/uploads/${filename}`;
  }, [filename]);

  console.log("🔗 fileUrl for signing:", fileUrl);


  if (!filename) {
    return <p>שם הקובץ לא זמין</p>;
  }

  const handleSigned = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('signed', blob, 'signature.png');
      formData.append('originalFilename', filename);

      const response = await fetch(`https://automation-project-server.onrender.com/signed/${filename}`, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      const responseData = isJson
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        console.warn("שגיאת fetch - לא סטטוס 200");
        alert('שגיאה בשליחת הקובץ החתום:\n' + JSON.stringify(responseData, null, 2));
        return;
      }

      setDone(true);
    } catch (err) {
      console.error("שגיאה כללית ב-fetch:", err);
      alert("שגיאה בשליחת הקובץ:\n" + (err as Error).message);
    }
  };

  if (done) return <p>הקובץ נחתם ונשלח למייל בהצלחה!</p>;

  return (
    <div>
      <h2>חתימה על המסמך</h2>
      <SignDocument fileUrl={fileUrl} onSigned={handleSigned} />
    </div>
  );
}

export default SignPage;



// import React, { useState, useMemo } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import SignDocument from '../SignaturePad/SignaturePad';

// function SignPage() {
//   const { filename } = useParams();
//   const [done, setDone] = useState(false);
//   const navigate = useNavigate();

//   const fileUrl = useMemo(() => {
//     // return `https://automation-digital-sign-flow.onrender.com/uploads/${filename}`;
// return `https://automation-project-server.onrender.com/uploads/${filename}`;

// }, [filename]);

//   if (!filename) {
//     return <p>שם הקובץ לא זמין</p>;
//   }

//   const handleSigned = async (blob: Blob) => {
//     try {
//       const formData = new FormData();
//       formData.append('signed', blob, 'signature.png');
//       formData.append('originalFilename', filename);

//       // const response = await fetch(`http://localhost:3001/signed/${filename}`, {
// const response = await fetch(`https://automation-project-server.onrender.com/signed/${filename}`, {

//         method: 'POST',
//         body: formData,
//       });

//       const contentType = response.headers.get("content-type");
//       const isJson = contentType?.includes("application/json");

//       const responseData = isJson
//         ? await response.json()
//         : await response.text();

//       if (!response.ok) {
//         console.warn("שגיאת fetch - לא סטטוס 200");
//         alert('שגיאה בשליחת הקובץ החתום:\n' + JSON.stringify(responseData, null, 2));
//         return;
//       }

//       setDone(true);
//     } catch (err) {
//       console.error("שגיאה כללית ב-fetch:", err);
//       alert("שגיאה בשליחת הקובץ:\n" + (err as Error).message);
//     }
//   };

//   if (done) return <p>הקובץ נחתם ונשלח למייל בהצלחה!</p>;
// const handleUploadSuccess = (filename: string) => {
//     navigate(`/sign/${encodeURIComponent(filename)}`);
//   };
//   return (
//     <button onClick={() => handleUploadSuccess('example.pdf')}>
//       חתימה
//     </button>
//   );
// }

// export default SignPage;
