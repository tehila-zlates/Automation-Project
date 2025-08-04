// import React, { useState, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import SignDocument from '../SignaturePad/SignaturePad';

// function SignPage() {
//   const { filename } = useParams();
//   const [done, setDone] = useState(false);

//   const fileUrl = useMemo(() => {
//     return `https://automation-project-server.onrender.com/uploads/${filename}`;
//   }, [filename]);

//   if (!filename) {
//     return <p>שם הקובץ לא זמין</p>;
//   }

//   const handleSigned = async (blob: Blob) => {
//     try {
//       const formData = new FormData();
//       formData.append('signed', blob, 'signature.png');
//       formData.append('originalFilename', filename);

//       const response = await fetch(`https://automation-project-server.onrender.com/signed/${filename}`, {
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

//   return (
//     <div>
//       <SignDocument fileUrl={fileUrl} onSigned={handleSigned} />
//     </div>
//   );
// }

// export default SignPage;


import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SignDocument from '../SignaturePad/SignaturePad';

function SignPage() {
  const { filename } = useParams();
  const [showSignature, setShowSignature] = useState(false);
  const [done, setDone] = useState(false);

  if (!filename) return <p>שם הקובץ לא זמין</p>;

  const fileUrl = useMemo(() => {
    return `https://automation-project-server.onrender.com/uploads/${filename}`;
  }, [filename]);

  const fullLink = `${window.location.origin}/sign/${filename}`;

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
        alert('שגיאה בשליחת הקובץ החתום:\n' + JSON.stringify(responseData, null, 2));
        return;
      }

      setDone(true);
    } catch (err) {
      alert("שגיאה בשליחת הקובץ:\n" + (err as Error).message);
    }
  };

  if (done) return (
    <div>
      <p>הקובץ נחתם ונשלח למייל בהצלחה!</p>
    </div>
  );

  if (!showSignature) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>לחתימה על המסמך, לחצי על הקישור:</p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowSignature(true);
          }}
        >
          {fullLink}
        </a>
      </div>
    );
  }

  return (
    <div>
      <SignDocument fileUrl={fileUrl} onSigned={handleSigned} />
    </div>
  );
}

export default SignPage;
