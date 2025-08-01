// import React, { useRef, useEffect, useState } from 'react';
// import * as pdfjs from 'pdfjs-dist/build/pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string, onSigned: (blob: Blob) => void }) {

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const renderTaskRef = useRef<any | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const isRenderingRef = useRef(false);

//   useEffect(() => {

//     const loadPDF = async () => {
//       if (isRenderingRef.current) {
//         return;
//       }

//       isRenderingRef.current = true;

//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//         renderTaskRef.current = null;
//       }

//       try {
//     console.log("789");

//         const loadingTask = pdfjs.getDocument(fileUrl);
//     console.log("789789");

//         const pdf = await loadingTask.promise;
//     console.log("789789789");

//         const page = await pdf.getPage(1);
//     console.log("789789789789");

//         const rotation = page.rotate;
//         const scale = 1.5;
//         const viewport = page.getViewport({ scale, rotation });

//         const canvas = canvasRef.current;
//         const context = canvas?.getContext('2d');
//         if (canvas && context) {
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;

//           renderTaskRef.current = page.render({ canvasContext: context, viewport });
//           await renderTaskRef.current.promise;
//           renderTaskRef.current = null;

//         }
//       } catch (error) {
//         if ((error as any).name === 'RenderingCancelledException') {
//           // רינדור בוטל          
//         } else {
//           console.error('Error rendering PDF:', error);
//         }
//       } finally {
//         isRenderingRef.current = false;
//       }
//     };

//     loadPDF();

//     return () => {
//       if (renderTaskRef.current) {
//         renderTaskRef.current.cancel();
//         renderTaskRef.current = null;
//       }
//     };
//   }, [fileUrl]);


//   const startDrawing = (e: any) => {
//     setIsDrawing(true);
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: any) => {
//     if (!isDrawing) return;
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {

//     if (canvasRef.current) {
//       canvasRef.current.toBlob(async (blob) => {
//         if (blob) {
//           try {
//             await onSigned(blob);
//           } catch (e) {
//             alert('שגיאה בשליחת הקובץ החתום');
//           }
//         }
//       }, 'image/png');
//     }
//   };

//   return (
//     <div>
//       <h3>חתום על הקובץ</h3>
//       {/* <canvas
//         ref={canvasRef}
//         onMouseDown={startDrawing}
//         onMouseMove={draw}
//         onMouseUp={stopDrawing}
//         onMouseLeave={stopDrawing}
//         style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
//       />
//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button> */}
//       <div style={{ position: 'relative', height: '100vh' }}>
//   <iframe
//     src={fileUrl}
//     style={{
//       width: '100%',
//       height: '100%',
//       border: 'none',
//     }}
//   />

//   <canvas
//     ref={canvasRef}
//     onMouseDown={startDrawing}
//     onMouseMove={draw}
//     onMouseUp={stopDrawing}
//     onMouseLeave={stopDrawing}
//     style={{
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       zIndex: 10,
//       backgroundColor: 'transparent',
//       pointerEvents: 'auto',
//     }}
//   />
// </div>

// <button onClick={handleSave}>סיום חתימה ושליחה</button>

//     </div>
//   );
// }

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string, onSigned: (blob: Blob) => void }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   useEffect(() => {
//     const iframe = document.querySelector('iframe');
//     const canvas = canvasRef.current;
//     if (iframe && canvas) {
//       const rect = iframe.getBoundingClientRect();
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//     }
//   }, []);

//   const startDrawing = (e: any) => {
//     setIsDrawing(true);
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: any) => {
//     if (!isDrawing) return;
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {
//     if (canvasRef.current) {
//       canvasRef.current.toBlob(async (blob) => {
//         if (blob) {
//           try {
//             await onSigned(blob);
//           } catch (e) {
//             alert('שגיאה בשליחת הקובץ החתום');
//           }
//         }
//       }, 'image/png');
//     }
//   };

//   return (
//     <div>
//       <h3>חתום על הקובץ</h3>
//       <div style={{ position: 'relative', height: '100vh' }}>
//         <iframe
//           src={fileUrl}
//           style={{
//             width: '100%',
//             height: '100%',
//             border: 'none',
//           }}
//         />

//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             zIndex: 10,
//             backgroundColor: 'transparent',
//             pointerEvents: 'auto',
//           }}
//         />
//       </div>

//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button>
//     </div>
//   );
// }

// export default SignDocument;
import React, { useRef, useEffect, useState } from 'react';

function SignDocument({
  fileUrl,
  onSigned,
}: {
  fileUrl: string;
  onSigned: (blob: Blob) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const resizeCanvas = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          try {
            await onSigned(blob);
          } catch {
            alert('שגיאה בשליחת הקובץ החתום');
          }
        }
      }, 'image/png');
    }
  };

  // פונקציה לפתיחת הקובץ בחלון חדש
  const openInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div>
      <h3>חתום על הקובץ</h3>

      {/* כפתור לפתיחה בחלון חדש */}
      <button
        onClick={openInNewTab}
        style={{ marginBottom: '10px' }}
        className="btn btn-primary"
      >
        פתח את הקובץ בחלון חדש
      </button>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '90vh',
        }}
      >
        <iframe
          src={fileUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            backgroundColor: 'transparent',
            pointerEvents: 'auto',
          }}
        />
      </div>

      <button className="btn btn-success mt-2" onClick={handleSave}>
        סיום חתימה ושליחה
      </button>
    </div>
  );
}

export default SignDocument;
